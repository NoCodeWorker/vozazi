---
name: llm-integration
description: Integración de LLMs para feedback pedagógico en VOZAZI. Use cuando implemente generación de feedback, prompt engineering, o integración con proveedores de LLM.
---

# LLM Integration Skill

Esta skill proporciona experiencia en integración de LLMs para generar feedback pedagógico contextualizado en VOZAZI.

## Objetivo

Implementar integración robusta y eficiente con LLMs (OpenAI, Anthropic) para generar explicaciones pedagógicas, recomendaciones de ejercicios y feedback personalizado.

## Instrucciones

### 1. Configuración de Proveedores

```python
# apps/audio-engine/domain/llm/providers.py
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, AsyncIterator
from dataclasses import dataclass
import os

@dataclass
class LLMResponse:
    """Respuesta de LLM"""
    content: str
    model: str
    usage: Dict[str, int]
    finish_reason: str

class LLMProvider(ABC):
    """Interfaz abstracta para proveedores de LLM"""
    
    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 500,
    ) -> LLMResponse:
        pass
    
    @abstractmethod
    async def generate_stream(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
    ) -> AsyncIterator[str]:
        pass

class OpenAIProvider(LLMProvider):
    """Proveedor OpenAI"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = 'gpt-4o-mini',
        base_url: Optional[str] = None,
    ):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.model = model
        self.base_url = base_url
        
        if not self.api_key:
            raise ValueError("OpenAI API key required")
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 500,
    ) -> LLMResponse:
        import aiohttp
        
        messages = []
        
        if system_prompt:
            messages.append({'role': 'system', 'content': system_prompt})
        
        messages.append({'role': 'user', 'content': prompt})
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                'https://api.openai.com/v1/chat/completions',
                headers={'Authorization': f'Bearer {self.api_key}'},
                json={
                    'model': self.model,
                    'messages': messages,
                    'temperature': temperature,
                    'max_tokens': max_tokens,
                },
            ) as response:
                data = await response.json()
                
                return LLMResponse(
                    content=data['choices'][0]['message']['content'],
                    model=data['model'],
                    usage=data['usage'],
                    finish_reason=data['choices'][0]['finish_reason'],
                )
    
    async def generate_stream(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
    ) -> AsyncIterator[str]:
        import aiohttp
        
        messages = []
        if system_prompt:
            messages.append({'role': 'system', 'content': system_prompt})
        messages.append({'role': 'user', 'content': prompt})
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                'https://api.openai.com/v1/chat/completions',
                headers={'Authorization': f'Bearer {self.api_key}'},
                json={
                    'model': self.model,
                    'messages': messages,
                    'temperature': temperature,
                    'stream': True,
                },
            ) as response:
                async for line in response.content:
                    line = line.decode('utf-8').strip()
                    if line.startswith('data: '):
                        data = line[6:]
                        if data == '[DONE]':
                            break
                        
                        import json
                        try:
                            parsed = json.loads(data)
                            content = parsed['choices'][0]['delta'].get('content', '')
                            if content:
                                yield content
                        except:
                            continue

class AnthropicProvider(LLMProvider):
    """Proveedor Anthropic (Claude)"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = 'claude-3-haiku-20240307',
    ):
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        self.model = model
        
        if not self.api_key:
            raise ValueError("Anthropic API key required")
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 500,
    ) -> LLMResponse:
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                'https://api.anthropic.com/v1/messages',
                headers={
                    'X-API-Key': self.api_key,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json',
                },
                json={
                    'model': self.model,
                    'max_tokens': max_tokens,
                    'system': system_prompt or '',
                    'messages': [
                        {'role': 'user', 'content': prompt}
                    ],
                },
            ) as response:
                data = await response.json()
                
                return LLMResponse(
                    content=data['content'][0]['text'],
                    model=data['model'],
                    usage={
                        'prompt_tokens': data['usage']['input_tokens'],
                        'completion_tokens': data['usage']['output_tokens'],
                    },
                    finish_reason=data['stop_reason'],
                )
```

### 2. Servicio de LLM con Retry y Cache

```python
# apps/audio-engine/services/llm_service.py
import asyncio
import hashlib
import json
from typing import Dict, Any, Optional, AsyncIterator
from redis import asyncio as aioredis
from .llm.providers import LLMProvider, LLMResponse, OpenAIProvider

class LLMService:
    """Servicio de LLM con cache, retry y rate limiting"""
    
    def __init__(
        self,
        provider: Optional[LLMProvider] = None,
        cache_enabled: bool = True,
        cache_ttl: int = 3600 * 24,  # 24 horas
        rate_limit: int = 60,  # requests por minuto
    ):
        self.provider = provider or OpenAIProvider()
        self.cache_enabled = cache_enabled
        self.cache_ttl = cache_ttl
        self.rate_limit = rate_limit
        self.redis: Optional[aioredis.Redis] = None
        self._request_times = []
    
    async def initialize(self, redis_url: Optional[str] = None):
        """Inicializar conexiones"""
        if redis_url and self.cache_enabled:
            self.redis = await aioredis.from_url(redis_url)
    
    async def generate_feedback(
        self,
        context: Dict[str, Any],
        temperature: float = 0.7,
        max_tokens: int = 500,
        use_cache: bool = True,
    ) -> str:
        """
        Generar feedback pedagógico
        
        Args:
            context: Contexto pedagógico estructurado
            temperature: Temperatura para generación
            max_tokens: Máximo de tokens
            use_cache: Usar cache si disponible
        """
        # 1. Construir prompts
        system_prompt = self._build_system_prompt()
        user_prompt = self._build_user_prompt(context)
        
        # 2. Check cache
        cache_key = self._get_cache_key(user_prompt, temperature)
        
        if use_cache and self.cache_enabled:
            cached = await self._get_from_cache(cache_key)
            if cached:
                return cached
        
        # 3. Rate limiting
        await self._enforce_rate_limit()
        
        # 4. Generar con retry
        response = await self._generate_with_retry(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            retries=3,
        )
        
        # 5. Guardar en cache
        if self.cache_enabled:
            await self._save_to_cache(cache_key, response.content)
        
        # 6. Loguear uso
        await self._log_usage(response.usage)
        
        return response.content
    
    async def generate_stream(
        self,
        context: Dict[str, Any],
        temperature: float = 0.7,
    ) -> AsyncIterator[str]:
        """Generar feedback en streaming"""
        system_prompt = self._build_system_prompt()
        user_prompt = self._build_user_prompt(context)
        
        async for chunk in self.provider.generate_stream(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=temperature,
        ):
            yield chunk
    
    def _build_system_prompt(self) -> str:
        """Construir system prompt para feedback pedagógico"""
        return """Eres un entrenador vocal experto y empático de VOZAZI.

Tu rol es:
1. Explicar errores vocales en lenguaje claro y accesible
2. Proporcionar ejercicios concretos y alcanzables
3. Ser alentador pero honesto sobre el progreso
4. Adaptar el lenguaje al nivel del usuario
5. Priorizar la salud vocal sobre el rendimiento

Reglas importantes:
- NUNCA sugieras ejercicios que causen dolor o tensión
- Si detectas posibles problemas de salud, recomienda consultar especialista
- Usa analogías y metáforas para explicar conceptos técnicos
- Mantén el feedback conciso (máximo 300 palabras)
- Incluye siempre un siguiente paso claro"""
    
    def _build_user_prompt(self, context: Dict[str, Any]) -> str:
        """Construir user prompt desde contexto"""
        return f"""
# Contexto del Usuario
- Nivel: {context.get('user_level', 'principiante')}
- Ejercicio: {context.get('exercise_type', 'desconocido')}
- Puntuación: {context.get('score', 0)}/100

# Error Principal
{context.get('dominant_weakness', 'no especificado')}

# Métricas
{self._format_metrics(context.get('metrics', {}))}

# Recursos Pedagógicos Disponibles
{self._format_resources(context.get('relevant_docs', []))}

Genera un feedback pedagógico completo siguiendo las instrucciones del sistema."""
    
    def _format_metrics(self, metrics: Dict[str, float]) -> str:
        """Formatear métricas para el prompt"""
        if not metrics:
            return "No disponibles"
        
        lines = []
        for key, value in metrics.items():
            if isinstance(value, float):
                lines.append(f"- {key}: {value:.2f}")
            else:
                lines.append(f"- {key}: {value}")
        
        return '\n'.join(lines)
    
    def _format_resources(self, resources: list) -> str:
        """Formatear recursos pedagógicos"""
        if not resources:
            return "No hay recursos específicos"
        
        lines = []
        for i, resource in enumerate(resources[:3], 1):
            content = resource.get('content', '')[:150]
            lines.append(f"{i}. {content}...")
        
        return '\n'.join(lines)
    
    async def _generate_with_retry(
        self,
        prompt: str,
        system_prompt: str,
        temperature: float,
        max_tokens: int,
        retries: int,
    ) -> LLMResponse:
        """Generar con reintentos"""
        last_error = None
        
        for attempt in range(retries):
            try:
                return await self.provider.generate(
                    prompt=prompt,
                    system_prompt=system_prompt,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
            except Exception as e:
                last_error = e
                
                if attempt < retries - 1:
                    # Backoff exponencial
                    delay = 2 ** attempt
                    await asyncio.sleep(delay)
        
        raise last_error
    
    def _get_cache_key(
        self,
        prompt: str,
        temperature: float,
    ) -> str:
        """Generar key de cache"""
        content = f"{prompt}:{temperature}"
        return f"llm_feedback:{hashlib.md5(content.encode()).hexdigest()}"
    
    async def _get_from_cache(self, key: str) -> Optional[str]:
        """Obtener de cache"""
        if not self.redis:
            return None
        
        cached = await self.redis.get(key)
        return cached.decode() if cached else None
    
    async def _save_to_cache(self, key: str, content: str):
        """Guardar en cache"""
        if not self.redis:
            return
        
        await self.redis.setex(key, self.cache_ttl, content)
    
    async def _enforce_rate_limit(self):
        """Aplicar rate limiting"""
        now = asyncio.get_event_loop().time()
        
        # Limpiar timestamps viejos
        self._request_times = [
            t for t in self._request_times
            if now - t < 60
        ]
        
        # Check límite
        if len(self._request_times) >= self.rate_limit:
            sleep_time = 60 - (now - self._request_times[0])
            if sleep_time > 0:
                await asyncio.sleep(sleep_time)
        
        self._request_times.append(now)
    
    async def _log_usage(self, usage: Dict[str, int]):
        """Loguear uso de tokens"""
        # Implementar logging a base de datos o sistema de métricas
        pass
    
    async def close(self):
        """Cerrar conexiones"""
        if self.redis:
            await self.redis.close()
```

### 3. Prompt Templates

```python
# apps/audio-engine/domain/llm/prompts.py
from typing import Dict, Any, List

class PromptTemplates:
    """Templates para prompts de LLM"""
    
    FEEDBACK_POST_SESSION = """
# Sesión Completada

## Tu Performance
- Ejercicio: {exercise_type}
- Duración: {duration_seconds:.1f} segundos
- Puntuación: {score}/100

## Lo que Hiciste Bien
{strengths}

## Área Principal de Mejora
{dominant_weakness}

## Ejercicio Recomendado
{recommended_exercise}

## Recurso Pedagógico
{linked_resource}

## Siguiente Paso
{next_step}
"""
    
    FEEDBACK_ERROR = """
# Error Detectado: {error_type}

## ¿Qué Significa Esto?
{explanation}

## ¿Por Qué Ocurre?
{causes}

## Cómo Corregirlo
{correction_steps}

## Ejercicio Específico
{exercise}

## Cuándo Preocuparse
{warnings}
"""
    
    PROGRESS_SUMMARY = """
# Tu Progreso Esta Semana

## Resumen
{summary}

## Mejoras Notables
{improvements}

## Áreas para Continuar Trabajando
{areas_to_work}

## Comparativa con la Semana Anterior
{comparison}

## Objetivo para la Próxima Semana
{next_week_goal}
"""
    
    @classmethod
    def render(cls, template_name: str, context: Dict[str, Any]) -> str:
        """Renderizar template con contexto"""
        template = getattr(cls, template_name, None)
        
        if not template:
            raise ValueError(f"Template {template_name} not found")
        
        return template.format(**context)
    
    @classmethod
    def add_variables(cls, template_name: str, variables: Dict[str, str]) -> None:
        """Añadir variables dinámicas a template"""
        template = getattr(cls, template_name, None)
        
        if template:
            for var, description in variables.items():
                template = template.replace(f"{{{var}}}", description)
            
            setattr(cls, template_name, template)
```

### 4. Evaluación y Validación de Respuestas

```python
# apps/audio-engine/domain/llm/response_validator.py
import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, validator

class FeedbackResponse(BaseModel):
    """Respuesta estructurada de feedback"""
    
    summary: str
    explanation: str
    recommended_exercises: List[str]
    linked_docs: List[str]
    next_step: str
    warnings: Optional[List[str]] = None
    
    @validator('summary')
    def validate_summary_length(cls, v):
        if len(v) < 20 or len(v) > 200:
            raise ValueError("Summary must be 20-200 characters")
        return v
    
    @validator('explanation')
    def validate_explanation(cls, v):
        # Verificar que no contenga consejos médicos
        medical_terms = ['diagnóstico', 'enfermedad', 'tratamiento', 'médico']
        for term in medical_terms:
            if term.lower() in v.lower():
                raise ValueError("Explanation should not contain medical advice")
        return v
    
    @validator('recommended_exercises')
    def validate_exercises(cls, v):
        if not v or len(v) > 3:
            raise ValueError("Must have 1-3 recommended exercises")
        return v

class ResponseValidator:
    """Validar respuestas de LLM"""
    
    DANGEROUS_PATTERNS = [
        r'ignora el dolor',
        r'continúa a pesar de',
        r'forza la voz',
        r'grita',
        r'lastima',
    ]
    
    def __init__(self):
        self.compiled_patterns = [
            re.compile(pattern, re.IGNORECASE)
            for pattern in self.DANGEROUS_PATTERNS
        ]
    
    def validate_feedback(self, content: str) -> Dict[str, Any]:
        """Validar feedback completo"""
        issues = []
        
        # 1. Check patrones peligrosos
        for pattern in self.compiled_patterns:
            if pattern.search(content):
                issues.append(f"Dangerous pattern detected: {pattern.pattern}")
        
        # 2. Check longitud
        if len(content) > 1000:
            issues.append("Feedback too long")
        
        # 3. Check estructura básica
        if not self._has_structure(content):
            issues.append("Missing basic structure")
        
        # 4. Extraer y validar secciones
        sections = self._extract_sections(content)
        
        return {
            'valid': len(issues) == 0,
            'issues': issues,
            'sections': sections,
            'content': content,
        }
    
    def _has_structure(self, content: str) -> bool:
        """Verificar que tenga estructura básica"""
        required_sections = ['explicación', 'ejercicio', 'siguiente']
        
        return all(
            any(section in content.lower() for section in required_sections)
        )
    
    def _extract_sections(self, content: str) -> Dict[str, str]:
        """Extraer secciones del contenido"""
        sections = {}
        
        # Implementar extracción por headers o patrones
        current_section = None
        current_content = []
        
        for line in content.split('\n'):
            if line.startswith('#') or line.startswith('##'):
                if current_section:
                    sections[current_section] = '\n'.join(current_content)
                current_section = line.strip('# ').strip()
                current_content = []
            elif current_section:
                current_content.append(line)
        
        if current_section:
            sections[current_section] = '\n'.join(current_content)
        
        return sections
    
    def sanitize_response(self, content: str) -> str:
        """Sanitizar respuesta (eliminar contenido peligroso)"""
        sanitized = content
        
        for pattern in self.compiled_patterns:
            sanitized = pattern.sub('[CONTENIDO ELIMINADO POR SEGURIDAD]', sanitized)
        
        return sanitized
```

## Restricciones

- NO usar LLM para análisis acústico (solo para pedagogía)
- NO confiar ciegamente en respuestas del LLM
- NO olvidar validar contenido peligroso
- NO exceder límites de tokens
- Siempre implementar rate limiting
- Siempre cachear respuestas cuando sea posible
- Siempre loguear uso y costos

## Ejemplos

### Bueno: Pipeline Completo con Validación
```python
# apps/audio-engine/pipelines/llm_feedback.py
class LLMFeedbackPipeline:
    """Pipeline completo para feedback con LLM"""
    
    def __init__(
        self,
        llm_service: LLMService,
        validator: ResponseValidator,
    ):
        self.llm = llm_service
        self.validator = validator
    
    async def generate_safe_feedback(
        self,
        context: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Generar feedback seguro y validado"""
        
        # 1. Generar feedback
        raw_content = await self.llm.generate_feedback(context)
        
        # 2. Validar
        validation = self.validator.validate_feedback(raw_content)
        
        if not validation['valid']:
            # 3. Si hay issues, intentar regenerar
            if len(validation['issues']) <= 2:
                # Reintentar con instrucciones más estrictas
                context['strict_mode'] = True
                raw_content = await self.llm.generate_feedback(
                    context,
                    temperature=0.5,  # Más conservador
                )
                validation = self.validator.validate_feedback(raw_content)
            
            # Si aún hay issues, usar fallback
            if not validation['valid']:
                return self._get_fallback_feedback(context)
        
        # 4. Sanitizar
        sanitized = self.validator.sanitize_response(raw_content)
        
        # 5. Estructurar respuesta
        return {
            'feedback': sanitized,
            'sections': validation['sections'],
            'validated': True,
        }
    
    def _get_fallback_feedback(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Feedback fallback cuando LLM falla"""
        return {
            'feedback': f"""
# Feedback de tu Sesión

Completaste el ejercicio {context.get('exercise_type')} con una puntuación de {context.get('score')}/100.

## Área a Trabajar
{context.get('dominant_weakness', 'técnica vocal')}

## Recomendación
Continúa practicando ejercicios básicos de respiración y control.

## Siguiente Paso
Repite este ejercicio enfocándote en la consistencia.
""",
            'sections': {'general': 'fallback'},
            'validated': True,
        }
```
