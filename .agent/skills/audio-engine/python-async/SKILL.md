---
name: python-async
description: Python avanzado con programación asíncrona para el audio-engine de VOZAZI. Use cuando implemente procesamiento de audio, operaciones I/O, o código de alto rendimiento.
---

# Python Async Skill

Esta skill proporciona experiencia en Python avanzado con énfasis en programación asíncrona para el audio-engine de VOZAZI.

## Objetivo

Escribir código Python eficiente, asíncrono y bien estructurado para procesamiento de audio y operaciones I/O en el audio-engine.

## Instrucciones

### 1. Fundamentos de Asyncio

```python
# apps/audio-engine/domain/async_utils.py
import asyncio
import time
from typing import List, Callable, Any, TypeVar
from functools import wraps

T = TypeVar('T')

async def async_sleep(seconds: float) -> None:
    """Sleep asíncrono no bloqueante"""
    await asyncio.sleep(seconds)

async def run_in_executor(
    func: Callable[..., T], 
    *args: Any,
    executor: asyncio.AbstractExecutor | None = None
) -> T:
    """Ejecutar función síncrona en executor para no bloquear el event loop"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, func, *args)

async def gather_with_concurrency(
    n: int, 
    *coros: asyncio.Coroutine
) -> List[Any]:
    """Ejecutar coroutines con concurrencia limitada"""
    semaphore = asyncio.Semaphore(n)
    
    async def limited_coro(coro: asyncio.Coroutine) -> Any:
        async with semaphore:
            return await coro
    
    return await asyncio.gather(
        *(limited_coro(c) for c in coros)
    )

# Decorador para timeout
def with_timeout(seconds: float):
    """Decorator para añadir timeout a coroutines"""
    def decorator(func: Callable[..., asyncio.Coroutine]):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await asyncio.wait_for(func(*args, **kwargs), timeout=seconds)
        return wrapper
    return decorator

# Uso
@with_timeout(30.0)
async def process_large_audio(audio_data: bytes) -> dict:
    # Procesamiento con timeout de 30s
    pass
```

### 2. Context Managers Asíncronos

```python
# apps/audio-engine/infrastructure/audio_context.py
import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import aiofiles

class AudioProcessingContext:
    """Context manager para procesamiento de audio con cleanup automático"""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.temp_files: list[str] = []
        self.lock = asyncio.Lock()
    
    async def __aenter__(self) -> 'AudioProcessingContext':
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        # Cleanup de archivos temporales
        for file_path in self.temp_files:
            try:
                import os
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Error cleaning up {file_path}: {e}")
    
    async def create_temp_file(self, suffix: str = '.wav') -> str:
        """Crear archivo temporal trackeado para cleanup"""
        import tempfile
        async with self.lock:
            fd, path = await asyncio.get_event_loop().run_in_executor(
                None,
                tempfile.mkstemp,
                suffix,
                f'vozazi_{self.session_id}_'
            )
            self.temp_files.append(path)
            return path

@asynccontextmanager
async def audio_session(session_id: str) -> AsyncGenerator[AudioProcessingContext, None]:
    """Context manager para sesiones de audio"""
    context = AudioProcessingContext(session_id)
    try:
        yield context
    finally:
        await context.__aexit__(None, None, None)

# Uso
async def process_audio_session(session_id: str, audio_data: bytes):
    async with audio_session(session_id) as ctx:
        temp_file = await ctx.create_temp_file()
        # Procesar audio...
        # Cleanup automático al salir
```

### 3. Colas y Productor-Consumidor

```python
# apps/audio-engine/pipelines/audio_queue.py
import asyncio
from typing import Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class AudioTask:
    session_id: str
    task_id: str
    audio_chunk: bytes
    priority: int = 0
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()

class AudioProcessingQueue:
    """Cola prioritaria para procesamiento de audio"""
    
    def __init__(self, max_size: int = 100):
        self.queue = asyncio.PriorityQueue(maxsize=max_size)
        self.processed_count = 0
        self.error_count = 0
    
    async def put(self, task: AudioTask) -> None:
        """Añadir tarea a la cola"""
        # Usar timestamp negativo para prioridad (menor = más prioritario)
        priority = -task.priority
        await self.queue.put((priority, task.created_at.timestamp(), task))
    
    async def get(self) -> AudioTask:
        """Obtener siguiente tarea"""
        _, _, task = await self.queue.get()
        return task
    
    def task_done(self) -> None:
        self.processed_count += 1
        self.queue.task_done()
    
    async def join(self) -> None:
        await self.queue.join()
    
    @property
    def pending(self) -> int:
        return self.queue.qsize()

# Patrón productor-consumidor
async def producer(queue: AudioProcessingQueue, audio_stream: asyncio.Queue):
    """Productor: recibe chunks de audio y los encola"""
    while True:
        chunk = await audio_stream.get()
        if chunk is None:  # Señal de fin
            break
        
        task = AudioTask(
            session_id=chunk['session_id'],
            task_id=chunk['task_id'],
            audio_chunk=chunk['data'],
            priority=chunk.get('priority', 0),
        )
        await queue.put(task)

async def consumer(
    queue: AudioProcessingQueue,
    processor: callable,
    num_workers: int = 3
):
    """Consumidor: procesa tareas en paralelo"""
    
    async def worker(worker_id: int):
        print(f"Worker {worker_id} started")
        while True:
            try:
                task = await queue.get()
                await processor(task)
                queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                queue.error_count += 1
                print(f"Worker {worker_id} error: {e}")
    
    workers = [asyncio.create_task(worker(i)) for i in range(num_workers)]
    await asyncio.gather(*workers)
```

### 4. Streams de Audio Asíncronos

```python
# apps/audio-engine/pipelines/audio_stream.py
import asyncio
from typing import AsyncIterator, Callable, Awaitable
import io

class AudioStream:
    """Stream asíncrono para procesamiento de audio en tiempo real"""
    
    def __init__(self, buffer_size: int = 10):
        self.buffer = asyncio.Queue(maxsize=buffer_size)
        self.closed = False
    
    async def write(self, chunk: bytes) -> None:
        """Escribir chunk de audio"""
        if self.closed:
            raise RuntimeError("Stream is closed")
        await self.buffer.put(chunk)
    
    async def read(self) -> bytes | None:
        """Leer siguiente chunk"""
        if self.closed and self.buffer.empty():
            return None
        return await self.buffer.get()
    
    async def close(self) -> None:
        """Cerrar stream"""
        self.closed = True
    
    def __aiter__(self) -> 'AudioStream':
        return self
    
    async def __anext__(self) -> bytes:
        chunk = await self.read()
        if chunk is None:
            raise StopAsyncIteration
        return chunk

async def process_audio_stream(
    stream: AudioStream,
    processor: Callable[[bytes], Awaitable[bytes]],
    output_stream: AudioStream
):
    """Procesar stream de audio chunk por chunk"""
    async for chunk in stream:
        processed = await processor(chunk)
        await output_stream.write(processed)
    
    await output_stream.close()

# Pipeline de procesamiento
async def create_audio_pipeline(
    stages: list[Callable[[bytes], Awaitable[bytes]]]
) -> Callable[[bytes], Awaitable[bytes]]:
    """Crear pipeline de procesamiento"""
    
    async def pipeline(audio_data: bytes) -> bytes:
        result = audio_data
        for stage in stages:
            result = await stage(result)
        return result
    
    return pipeline
```

### 5. Manejo de Errores en Async

```python
# apps/audio-engine/infrastructure/error_handling.py
import asyncio
import logging
from typing import TypeVar, Callable, Awaitable, Optional
from functools import wraps
import time

logger = logging.getLogger(__name__)
T = TypeVar('T')

class RetryError(Exception):
    """Error después de múltiples reintentos"""
    pass

async def retry_with_backoff(
    func: Callable[..., Awaitable[T]],
    *args,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    exponential: bool = True,
    exceptions: tuple[type[Exception]] = (Exception,),
    **kwargs
) -> T:
    """Reintentar con backoff exponencial"""
    
    last_exception = None
    
    for attempt in range(max_retries + 1):
        try:
            return await func(*args, **kwargs)
        except exceptions as e:
            last_exception = e
            
            if attempt == max_retries:
                break
            
            # Calcular delay
            if exponential:
                delay = min(base_delay * (2 ** attempt), max_delay)
            else:
                delay = base_delay
            
            logger.warning(
                f"Attempt {attempt + 1} failed: {e}. Retrying in {delay}s",
                exc_info=True
            )
            
            await asyncio.sleep(delay)
    
    raise RetryError(f"Failed after {max_retries + 1} attempts") from last_exception

async def with_timeout_and_retry(
    func: Callable[..., Awaitable[T]],
    *args,
    timeout: float,
    max_retries: int = 3,
    **kwargs
) -> T:
    """Combinar timeout con retry"""
    
    async def wrapped():
        return await asyncio.wait_for(
            retry_with_backoff(func, *args, max_retries=max_retries, **kwargs),
            timeout=timeout * (max_retries + 1)
        )
    
    return await wrapped()

# Decorador para logging
def async_logged(func: Callable[..., Awaitable[T]]) -> Callable[..., Awaitable[T]]:
    """Decorator para loguear ejecución de async functions"""
    
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        logger.info(f"Starting {func.__name__}")
        
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start_time
            logger.info(f"Completed {func.__name__} in {duration:.2f}s")
            return result
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"Failed {func.__name__} after {duration:.2f}s: {e}")
            raise
    
    return wrapper

# Uso
@async_logged
async def process_audio_chunk(audio_data: bytes) -> dict:
    return await retry_with_backoff(
        _process_audio_impl,
        audio_data,
        max_retries=3,
        exceptions=(ConnectionError, TimeoutError)
    )
```

### 6. Task Groups y Cancelación

```python
# apps/audio-engine/infrastructure/task_management.py
import asyncio
from typing import List, Callable, Awaitable, Any

async def run_tasks_with_timeout(
    coros: List[Awaitable[Any]],
    timeout: float,
    return_exceptions: bool = True
) -> List[Any]:
    """Ejecutar múltiples tasks con timeout global"""
    try:
        results = await asyncio.wait_for(
            asyncio.gather(*coros, return_exceptions=return_exceptions),
            timeout=timeout
        )
        return results
    except asyncio.TimeoutError:
        logger.error(f"Tasks timed out after {timeout}s")
        raise

async def run_with_cancellation_protection(
    coro: Awaitable[T],
    cleanup: Callable[[], Awaitable[None]]
) -> T:
    """Ejecutar coroutine con cleanup garantizado incluso en cancelación"""
    task = asyncio.create_task(coro)
    
    try:
        return await task
    except asyncio.CancelledError:
        # Esperar a que el cleanup termine
        await cleanup()
        raise
    except Exception:
        await cleanup()
        raise

# Task group pattern (Python 3.11+)
async def process_audio_batch(
    audio_chunks: list[bytes],
    processor: Callable[[bytes], Awaitable[dict]]
) -> list[dict]:
    """Procesar batch de chunks en paralelo"""
    
    async with asyncio.TaskGroup() as tg:
        tasks = [
            tg.create_task(processor(chunk))
            for chunk in audio_chunks
        ]
    
    return [task.result() for task in tasks]

# Para Python < 3.11
async def process_audio_batch_legacy(
    audio_chunks: list[bytes],
    processor: Callable[[bytes], Awaitable[dict]]
) -> list[dict]:
    tasks = [asyncio.create_task(processor(chunk)) for chunk in audio_chunks]
    
    try:
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Manejar errores individuales
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Chunk {i} failed: {result}")
                processed_results.append({'error': str(result)})
            else:
                processed_results.append(result)
        
        return processed_results
    except Exception as e:
        # Cancelar todas las tasks pendientes
        for task in tasks:
            task.cancel()
        raise
```

## Restricciones

- NO bloquear el event loop con operaciones síncronas pesadas
- NO usar `time.sleep()` (usar `asyncio.sleep()`)
- NO olvidar cancelar tasks cuando corresponda
- NO ignorar excepciones en tasks en segundo plano
- Siempre usar `asyncio.gather()` con `return_exceptions=True` para tareas críticas
- Siempre hacer cleanup de recursos en finally o context managers
- Siempre loguear errores con contexto suficiente

## Ejemplos

### Bueno: Servicio de Procesamiento Asíncrono
```python
# apps/audio-engine/services/analysis_service.py
import asyncio
import aiofiles
import torch
import torchaudio
from typing import Dict, Any

class AnalysisService:
    def __init__(self, device: str = 'cpu'):
        self.device = device
        self.model = None
    
    async def initialize(self) -> None:
        """Inicializar modelos en background"""
        loop = asyncio.get_event_loop()
        
        # Cargar modelo en executor para no bloquear
        self.model = await loop.run_in_executor(
            None,
            lambda: torch.hub.load('marl/crepe', 'full', device=self.device)
        )
    
    async def extract_metrics(
        self,
        audio_data: bytes,
        exercise_type: str,
        target_note: str | None = None
    ) -> Dict[str, float]:
        """Extraer métricas de audio de forma asíncrona"""
        
        async with audio_session('temp') as ctx:
            # Guardar audio temporalmente
            temp_path = await ctx.create_temp_file()
            
            async with aiofiles.open(temp_path, 'wb') as f:
                await f.write(audio_data)
            
            # Procesar en executor (CPU-intensive)
            loop = asyncio.get_event_loop()
            metrics = await loop.run_in_executor(
                None,
                self._extract_metrics_sync,
                temp_path,
                exercise_type,
                target_note
            )
        
        return metrics
    
    def _extract_metrics_sync(
        self,
        audio_path: str,
        exercise_type: str,
        target_note: str | None
    ) -> Dict[str, float]:
        """Implementación síncrona del procesamiento"""
        waveform, sample_rate = torchaudio.load(audio_path)
        
        # Pitch detection con torchcrepe
        pitch = self.model(waveform, sample_rate)
        
        # Calcular métricas
        return {
            'pitch_accuracy': self._calculate_accuracy(pitch, target_note),
            'pitch_stability': self._calculate_stability(pitch),
        }
```
