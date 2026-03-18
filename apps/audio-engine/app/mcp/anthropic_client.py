"""
MCP Client for Anthropic API.

This module provides integration with Anthropic's Claude models
for advanced text analysis and conversation.
"""

import asyncio
from typing import Optional, Dict, Any, List
import structlog
from anthropic import AsyncAnthropic

from app.config import settings

logger = structlog.get_logger()


class AnthropicMCP:
    """
    Model Context Protocol (MCP) client for Anthropic.
    
    Provides access to Claude models for:
    - Advanced text analysis
    - Conversation and Q&A
    - Document understanding
    """
    
    _instance: Optional["AnthropicMCP"] = None
    _initialized: bool = False
    
    def __new__(cls) -> "AnthropicMCP":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self) -> None:
        if not self._initialized:
            if settings.ANTHROPIC_API_KEY:
                self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            else:
                self.client = None
            self._initialized = True
    
    def is_available(self) -> bool:
        """Check if Anthropic is configured."""
        return self.client is not None and settings.ANTHROPIC_API_KEY is not None
    
    async def health_check(self) -> dict:
        """Check Anthropic API connection health."""
        if not self.is_available():
            return {
                "status": "unavailable",
                "service": "anthropic",
                "error": "API key not configured"
            }
        
        try:
            # Simple API call to verify connection
            await self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=10,
                messages=[{"role": "user", "content": "Hello"}]
            )
            return {
                "status": "healthy",
                "service": "anthropic"
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "anthropic",
                "error": str(e)
            }
    
    async def analyze_text(
        self,
        text: str,
        task: str = "analyze",
        model: str = "claude-3-haiku-20240307",
        max_tokens: int = 1024,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None
    ) -> Optional[str]:
        """
        Analyze text using Claude.
        
        Args:
            text: The text to analyze
            task: The analysis task type
            model: The Claude model to use
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0-1)
            system_prompt: Optional system prompt
        
        Returns:
            Analysis result as string
        """
        if not self.is_available():
            return None
        
        task_prompts = {
            "analyze": "Analyze the following text thoroughly:",
            "summarize": "Provide a concise, comprehensive summary of the following text:",
            "extract_keywords": "Extract the most important keywords and topics from the following text. Return as a bulleted list:",
            "detect_emotion": "Analyze the emotional content and tone of the following text. Identify primary and secondary emotions:",
            "detect_sentiment": "Analyze the sentiment of the following text. Indicate if it's positive, negative, or neutral, and explain your reasoning:",
            "extract_action_items": "Extract all action items, commitments, and next steps from the following text:",
            "generate_title": "Generate 3 concise, descriptive title options for the following text:",
            "identify_speakers": "Identify and summarize the different speakers/voices in this transcript:",
            "extract_quotes": "Extract the most significant and impactful quotes from the following text:"
        }
        
        default_system = "You are an expert analyst specializing in audio transcript analysis. Provide clear, accurate, and insightful analysis."
        
        try:
            response = await self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                system=system_prompt or default_system,
                messages=[
                    {
                        "role": "user",
                        "content": f"{task_prompts.get(task, task_prompts['analyze'])}\n\n{text}"
                    }
                ],
                temperature=temperature
            )
            
            result = response.content[0].text
            logger.info("Text analyzed with Anthropic Claude", task=task, model=model)
            return result
            
        except Exception as e:
            logger.error("Anthropic analysis failed", task=task, error=str(e))
            return None
    
    async def analyze_transcript(
        self,
        transcript: str,
        include_summary: bool = True,
        include_keywords: bool = True,
        include_sentiment: bool = True,
        include_emotions: bool = True,
        include_action_items: bool = True,
        model: str = "claude-3-haiku-20240307"
    ) -> Dict[str, Any]:
        """
        Perform comprehensive analysis of a transcript using Claude.
        
        Args:
            transcript: The full transcript text
            include_summary: Include a summary
            include_keywords: Include keywords extraction
            include_sentiment: Include sentiment analysis
            include_emotions: Include emotion detection
            include_action_items: Include action items extraction
            model: The Claude model to use
        
        Returns:
            dict with all requested analyses
        """
        tasks = []
        keys = []
        
        if include_summary:
            tasks.append(self.analyze_text(transcript, "summarize", model=model))
            keys.append("summary")
        
        if include_keywords:
            tasks.append(self.analyze_text(transcript, "extract_keywords", model=model))
            keys.append("keywords")
        
        if include_sentiment:
            tasks.append(self.analyze_text(transcript, "detect_sentiment", model=model))
            keys.append("sentiment")
        
        if include_emotions:
            tasks.append(self.analyze_text(transcript, "detect_emotion", model=model))
            keys.append("emotions")
        
        if include_action_items:
            tasks.append(self.analyze_text(transcript, "extract_action_items", model=model))
            keys.append("action_items")
        
        results = await asyncio.gather(*tasks)
        
        analysis = {}
        for key, result in zip(keys, results):
            analysis[key] = result
        
        return analysis
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        model: str = "claude-3-sonnet-20240229",
        max_tokens: int = 1024,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None
    ) -> Optional[str]:
        """
        Have a conversation with Claude.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: The Claude model to use
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
            system_prompt: Optional system prompt
        
        Returns:
            Claude's response
        """
        if not self.is_available():
            return None
        
        try:
            response = await self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                system=system_prompt,
                messages=messages,
                temperature=temperature
            )
            
            return response.content[0].text
            
        except Exception as e:
            logger.error("Anthropic chat failed", error=str(e))
            return None
    
    async def extract_structured_data(
        self,
        text: str,
        schema_description: str,
        model: str = "claude-3-haiku-20240307"
    ) -> Optional[Dict[str, Any]]:
        """
        Extract structured data from text.
        
        Args:
            text: The text to extract data from
            schema_description: Description of the expected output structure
            model: The Claude model to use
        
        Returns:
            Extracted data as a dictionary
        """
        if not self.is_available():
            return None
        
        prompt = f"""Extract the following information from the text below and return it as valid JSON.

Expected structure:
{schema_description}

Text to analyze:
{text}

Return ONLY the JSON, no other text."""

        try:
            import json
            
            response = await self.client.messages.create(
                model=model,
                max_tokens=1024,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            result_text = response.content[0].text
            
            # Try to parse as JSON
            try:
                # Handle markdown code blocks if present
                if "```json" in result_text:
                    result_text = result_text.split("```json")[1].split("```")[0]
                elif "```" in result_text:
                    result_text = result_text.split("```")[1].split("```")[0]
                
                return json.loads(result_text.strip())
            except json.JSONDecodeError:
                logger.warning("Failed to parse JSON from Claude response")
                return {"raw_response": result_text}
            
        except Exception as e:
            logger.error("Structured data extraction failed", error=str(e))
            return None


# Global instance
anthropic_mcp = AnthropicMCP()
