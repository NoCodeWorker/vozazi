"""
MCP Client for OpenAI API.

This module provides integration with OpenAI services including
Whisper for transcription and GPT models for analysis.
"""

import asyncio
from typing import Optional, Dict, Any, List, Union
from pathlib import Path
import structlog
from openai import AsyncOpenAI
from openai.types.audio import Transcription

from app.config import settings

logger = structlog.get_logger()


class OpenAIMCP:
    """
    Model Context Protocol (MCP) client for OpenAI.
    
    Provides access to OpenAI services including:
    - Whisper for audio transcription
    - GPT-4 for text analysis and summarization
    - Text embeddings for vector search
    """
    
    _instance: Optional["OpenAIMCP"] = None
    _initialized: bool = False
    
    def __new__(cls) -> "OpenAIMCP":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self) -> None:
        if not self._initialized:
            if settings.OPENAI_API_KEY:
                self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            else:
                self.client = None
            self._initialized = True
    
    def is_available(self) -> bool:
        """Check if OpenAI is configured."""
        return self.client is not None and settings.OPENAI_API_KEY is not None
    
    async def health_check(self) -> dict:
        """Check OpenAI API connection health."""
        if not self.is_available():
            return {
                "status": "unavailable",
                "service": "openai",
                "error": "API key not configured"
            }
        
        try:
            # Simple API call to verify connection
            await self.client.models.list()
            return {
                "status": "healthy",
                "service": "openai",
                "models_available": True
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "openai",
                "error": str(e)
            }
    
    async def transcribe_audio(
        self,
        audio_file_path: Union[str, Path],
        language: Optional[str] = None,
        prompt: Optional[str] = None,
        temperature: float = 0,
        timestamp_granularities: Optional[List[str]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Transcribe audio using Whisper.
        
        Args:
            audio_file_path: Path to the audio file
            language: Optional language code (e.g., 'en', 'es')
            prompt: Optional prompt to guide transcription
            temperature: Sampling temperature (0-1)
            timestamp_granularities: List of timestamp types ('word', 'segment')
        
        Returns:
            dict with transcription result
        """
        if not self.is_available():
            logger.warning("OpenAI not available for transcription")
            return None
        
        try:
            with open(audio_file_path, "rb") as audio_file:
                params = {
                    "model": "whisper-1",
                    "file": audio_file,
                    "temperature": temperature
                }
                
                if language:
                    params["language"] = language
                
                if prompt:
                    params["prompt"] = prompt
                
                if timestamp_granularities:
                    params["timestamp_granularities"] = timestamp_granularities
                    response_format = "verbose_json"
                else:
                    response_format = "json"
                
                params["response_format"] = response_format
                
                transcription = await self.client.audio.transcriptions.create(**params)
                
                result = {
                    "text": transcription.text,
                    "language": getattr(transcription, "language", None),
                    "duration": getattr(transcription, "duration", None)
                }
                
                if timestamp_granularities:
                    result["segments"] = getattr(transcription, "segments", [])
                    result["words"] = getattr(transcription, "words", [])
                
                logger.info(
                    "Audio transcribed with OpenAI Whisper",
                    path=str(audio_file_path),
                    language=result["language"]
                )
                
                return result
                
        except Exception as e:
            logger.error("OpenAI transcription failed", path=str(audio_file_path), error=str(e))
            return None
    
    async def transcribe_audio_bytes(
        self,
        audio_bytes: bytes,
        filename: str = "audio.wav",
        language: Optional[str] = None,
        prompt: Optional[str] = None,
        temperature: float = 0
    ) -> Optional[Dict[str, Any]]:
        """Transcribe audio from bytes."""
        if not self.is_available():
            return None
        
        try:
            from io import BytesIO
            audio_file = BytesIO(audio_bytes)
            audio_file.name = filename
            
            params = {
                "model": "whisper-1",
                "file": audio_file,
                "temperature": temperature,
                "response_format": "json"
            }
            
            if language:
                params["language"] = language
            
            if prompt:
                params["prompt"] = prompt
            
            transcription = await self.client.audio.transcriptions.create(**params)
            
            return {
                "text": transcription.text,
                "language": getattr(transcription, "language", None),
                "duration": getattr(transcription, "duration", None)
            }
            
        except Exception as e:
            logger.error("OpenAI transcription failed", error=str(e))
            return None
    
    async def analyze_text(
        self,
        text: str,
        task: str = "summarize",
        model: str = "gpt-4o-mini",
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> Optional[str]:
        """
        Analyze text using GPT models.
        
        Args:
            text: The text to analyze
            task: The analysis task (summarize, extract_keywords, detect_emotion, etc.)
            model: The model to use
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
        
        Returns:
            Analysis result as string
        """
        if not self.is_available():
            return None
        
        task_prompts = {
            "summarize": "Provide a concise summary of the following text:",
            "extract_keywords": "Extract the key topics and keywords from the following text. Return as a comma-separated list:",
            "detect_emotion": "Analyze the emotional tone of the following text. Describe the primary emotions detected:",
            "detect_sentiment": "Analyze the sentiment of the following text (positive, negative, or neutral) and explain:",
            "extract_action_items": "Extract any action items or commitments from the following text:",
            "generate_title": "Generate a concise, descriptive title for the following text:"
        }
        
        system_prompt = "You are an expert text analyst. Provide clear, accurate, and concise analysis."
        user_prompt = task_prompts.get(task, task_prompts["summarize"])
        
        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"{user_prompt}\n\n{text}"}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            result = response.choices[0].message.content
            logger.info("Text analyzed with OpenAI", task=task, model=model)
            return result
            
        except Exception as e:
            logger.error("OpenAI text analysis failed", task=task, error=str(e))
            return None
    
    async def analyze_transcript(
        self,
        transcript: str,
        include_summary: bool = True,
        include_keywords: bool = True,
        include_sentiment: bool = True,
        include_action_items: bool = True
    ) -> Dict[str, Any]:
        """
        Perform comprehensive analysis of a transcript.
        
        Args:
            transcript: The full transcript text
            include_summary: Include a summary
            include_keywords: Include keywords extraction
            include_sentiment: Include sentiment analysis
            include_action_items: Include action items extraction
        
        Returns:
            dict with all requested analyses
        """
        tasks = []
        
        if include_summary:
            tasks.append(self.analyze_text(transcript, "summarize"))
        else:
            tasks.append(asyncio.coroutine(lambda: None)())
        
        if include_keywords:
            tasks.append(self.analyze_text(transcript, "extract_keywords"))
        else:
            tasks.append(asyncio.coroutine(lambda: None)())
        
        if include_sentiment:
            tasks.append(self.analyze_text(transcript, "detect_sentiment"))
        else:
            tasks.append(asyncio.coroutine(lambda: None)())
        
        if include_action_items:
            tasks.append(self.analyze_text(transcript, "extract_action_items"))
        else:
            tasks.append(asyncio.coroutine(lambda: None)())
        
        results = await asyncio.gather(*tasks)
        
        return {
            "summary": results[0] if include_summary else None,
            "keywords": results[1] if include_keywords else None,
            "sentiment": results[2] if include_sentiment else None,
            "action_items": results[3] if include_action_items else None
        }
    
    async def generate_embeddings(
        self,
        text: str,
        model: str = "text-embedding-3-small"
    ) -> Optional[List[float]]:
        """Generate embeddings for text."""
        if not self.is_available():
            return None
        
        try:
            response = await self.client.embeddings.create(
                model=model,
                input=text
            )
            return response.data[0].embedding
            
        except Exception as e:
            logger.error("OpenAI embeddings generation failed", error=str(e))
            return None
    
    async def generate_speech(
        self,
        text: str,
        voice: str = "alloy",
        model: str = "tts-1",
        response_format: str = "mp3",
        speed: float = 1.0
    ) -> Optional[bytes]:
        """
        Generate speech from text using TTS.
        
        Args:
            text: Text to convert to speech
            voice: Voice to use (alloy, echo, fable, onyx, nova, shimmer)
            model: TTS model (tts-1 or tts-1-hd)
            response_format: Output format (mp3, opus, aac, flac, wav, pcm)
            speed: Speech speed (0.25 to 4.0)
        
        Returns:
            Audio bytes
        """
        if not self.is_available():
            return None
        
        try:
            response = await self.client.audio.speech.create(
                model=model,
                voice=voice,
                input=text,
                response_format=response_format,
                speed=speed
            )
            
            return response.content
            
        except Exception as e:
            logger.error("OpenAI TTS failed", error=str(e))
            return None


# Global instance
openai_mcp = OpenAIMCP()
