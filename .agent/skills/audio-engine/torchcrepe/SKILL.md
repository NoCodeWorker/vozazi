---
name: torchcrepe
description: torchcrepe para pitch detection con deep learning en VOZAZI. Use cuando implemente detección de frecuencia fundamental, análisis de nota, o métricas de afinación.
---

# torchcrepe Pitch Detection Skill

Esta skill proporciona experiencia en torchcrepe para detección precisa de pitch usando deep learning en el audio-engine de VOZAZI.

## Objetivo

Implementar detección de pitch de alta precisión usando torchcrepe (CREPE) para análisis vocal en VOZAZI, con optimización para inferencia en tiempo real y post-procesamiento.

## Instrucciones

### 1. Configuración e Instalación

```bash
# requirements.txt
torch>=2.0.0
torchaudio>=2.0.0
torchcrepe>=0.0.20
numpy>=1.24.0
librosa>=0.10.0
```

```python
# apps/audio-engine/domain/pitch/torchcrepe_wrapper.py
import torch
import torchcrepe
import torchaudio
import numpy as np
from typing import Tuple, Optional
from dataclasses import dataclass

@dataclass
class PitchFrame:
    """Representa un frame de detección de pitch"""
    frequency: float  # Hz
    confidence: float  # 0-1
    note: Optional[str] = None
    cents: Optional[float] = None
    timestamp_ms: float = 0.0

class TorchCrepePitchDetector:
    """Wrapper para torchcrepe con configuración optimizada para VOZAZI"""
    
    def __init__(
        self,
        model: str = 'full',  # 'full' o 'tiny'
        device: str = 'cpu',
        sample_rate: int = 16000,
        hop_length: int = 160,  # 10ms a 16kHz
    ):
        self.model = model
        self.device = device
        self.sample_rate = sample_rate
        self.hop_length = hop_length
        
        # Cargar modelo
        self._load_model()
    
    def _load_model(self):
        """Cargar modelo CREPE"""
        # CREPE se carga automáticamente la primera vez que se usa
        # Pero podemos forzar la carga en caliente
        if self.device == 'cuda' and not torch.cuda.is_available():
            self.device = 'cpu'
            print("CUDA no disponible, usando CPU")
    
    def detect(
        self,
        audio: np.ndarray,
        fmin: float = 80.0,  # Frecuencia mínima (E2)
        fmax: float = 1000.0,  # Frecuencia máxima (C6)
    ) -> list[PitchFrame]:
        """
        Detectar pitch de audio completo
        
        Args:
            audio: Audio normalizado (-1 a 1)
            fmin: Frecuencia mínima a detectar
            fmax: Frecuencia máxima a detectar
            
        Returns:
            Lista de PitchFrame con frecuencia, confianza, nota y cents
        """
        # Convertir a tensor
        audio_tensor = torch.from_numpy(audio).float().to(self.device)
        
        # Añadir dimensión de batch si es necesario
        if audio_tensor.dim() == 1:
            audio_tensor = audio_tensor.unsqueeze(0)
        
        # Ejecutar CREPE
        pitch, confidence = torchcrepe.predict(
            audio_tensor,
            self.sample_rate,
            self.hop_length,
            fmin,
            fmax,
            model=self.model,
            device=self.device,
            return_periodicity=True,
        )
        
        # Mover a CPU y convertir a numpy
        pitch = pitch.squeeze(0).cpu().numpy()
        confidence = confidence.squeeze(0).cpu().numpy()
        
        # Convertir a PitchFrames
        frames = []
        time_step = self.hop_length / self.sample_rate * 1000  # ms
        
        for i, (freq, conf) in enumerate(zip(pitch, confidence)):
            frame = PitchFrame(
                frequency=float(freq),
                confidence=float(conf),
                timestamp_ms=i * time_step,
            )
            
            # Calcular nota y cents si hay pitch válido
            if freq > 0 and conf > 0.3:  # Umbral de confianza
                frame.note, frame.cents = self._frequency_to_note(freq)
            
            frames.append(frame)
        
        return frames
    
    def _frequency_to_note(self, frequency: float) -> Tuple[str, float]:
        """Convertir frecuencia a nota y cents de desviación"""
        if frequency <= 0:
            return ('', 0.0)
        
        # A4 = 440Hz
        A4 = 440.0
        
        # Calcular número de MIDI
        midi_number = 69 + 12 * np.log2(frequency / A4)
        midi_rounded = round(midi_number)
        
        # Calcular cents de desviación
        cents = (midi_number - midi_rounded) * 100
        
        # Nombres de notas
        note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        note_index = midi_rounded % 12
        octave = (midi_rounded // 12) - 1
        
        note = f"{note_names[note_index]}{octave}"
        
        return (note, cents)
```

### 2. Detección en Tiempo Real Optimizada

```python
# apps/audio-engine/pipelines/realtime_pitch.py
import torch
import numpy as np
from typing import Optional, Callable
from collections import deque
import asyncio

class RealtimePitchDetector:
    """Detector de pitch optimizado para tiempo real"""
    
    def __init__(
        self,
        model: str = 'tiny',  # Usar 'tiny' para tiempo real
        device: str = 'cpu',
        buffer_size_ms: int = 100,  # Buffer de 100ms
        sample_rate: int = 16000,
    ):
        self.sample_rate = sample_rate
        self.buffer_size_samples = int(sample_rate * buffer_size_ms / 1000)
        self.hop_length = 160  # 10ms a 16kHz
        
        # Buffer circular para audio
        self.audio_buffer = deque(maxlen=self.buffer_size_samples)
        
        # Modelo
        self.device = device
        self.model = model
        self._model_loaded = False
    
    def load_model(self):
        """Cargar modelo en segundo plano"""
        # Solo cargar cuando sea necesario
        self._model_loaded = True
    
    def add_audio_chunk(self, audio_chunk: np.ndarray):
        """Añadir chunk de audio al buffer"""
        for sample in audio_chunk:
            self.audio_buffer.append(sample)
    
    async def detect_pitch_async(
        self,
        callback: Optional[Callable[[float, float, str, float], None]] = None
    ) -> tuple[float, float, str, float]:
        """
        Detectar pitch de forma asíncrona
        
        Returns:
            (frecuencia, confianza, nota, cents)
        """
        if len(self.audio_buffer) < self.buffer_size_samples:
            return (0.0, 0.0, '', 0.0)
        
        # Convertir buffer a array
        audio = np.array(list(self.audio_buffer), dtype=np.float32)
        
        # Normalizar
        audio = audio / np.max(np.abs(audio)) if np.max(np.abs(audio)) > 0 else audio
        
        # Ejecutar en executor para no bloquear
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            self._detect_sync,
            audio
        )
        
        frequency, confidence, note, cents = result
        
        if callback and confidence > 0.3:
            callback(frequency, confidence, note, cents)
        
        return result
    
    def _detect_sync(self, audio: np.ndarray) -> tuple[float, float, str, float]:
        """Detección síncrona para ejecutar en executor"""
        if not self._model_loaded:
            self.load_model()
        
        audio_tensor = torch.from_numpy(audio).float().unsqueeze(0).to(self.device)
        
        try:
            pitch, confidence = torchcrepe.predict(
                audio_tensor,
                self.sample_rate,
                self.hop_length,
                80.0,  # fmin
                1000.0,  # fmax
                model=self.model,
                device=self.device,
                return_periodicity=True,
            )
            
            # Tomar el frame más reciente
            freq = pitch[0, -1].item()
            conf = confidence[0, -1].item()
            
            # Calcular nota
            if freq > 0 and conf > 0.3:
                note, cents = self._frequency_to_note(freq)
            else:
                note, cents = '', 0.0
            
            return (freq, conf, note, cents)
            
        except Exception as e:
            print(f"Pitch detection error: {e}")
            return (0.0, 0.0, '', 0.0)
    
    def _frequency_to_note(self, frequency: float) -> tuple[str, float]:
        """Convertir frecuencia a nota"""
        A4 = 440.0
        midi_number = 69 + 12 * np.log2(frequency / A4)
        midi_rounded = round(midi_number)
        cents = (midi_number - midi_rounded) * 100
        
        note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        note_index = midi_rounded % 12
        octave = (midi_rounded // 12) - 1
        
        return (f"{note_names[note_index]}{octave}", cents)
```

### 3. Cálculo de Métricas de Afinación

```python
# apps/audio-engine/domain/metrics/pitch_metrics.py
import numpy as np
from typing import list
from .torchcrepe_wrapper import PitchFrame

class PitchMetricsCalculator:
    """Calcular métricas de afinación a partir de pitch detection"""
    
    def __init__(self, target_frequency: Optional[float] = None):
        self.target_frequency = target_frequency
    
    def calculate_accuracy(
        self,
        frames: list[PitchFrame],
        target_frequency: Optional[float] = None
    ) -> float:
        """
        Calcular precisión de afinación (0-1)
        
        Compara el pitch detectado con la nota objetivo
        """
        target = target_frequency or self.target_frequency
        
        if not target or not frames:
            return 0.0
        
        # Filtrar frames con baja confianza
        valid_frames = [f for f in frames if f.confidence > 0.3 and f.frequency > 0]
        
        if not valid_frames:
            return 0.0
        
        # Calcular desviación en cents para cada frame
        deviations = []
        for frame in valid_frames:
            cents = self._frequency_to_cents(frame.frequency, target)
            deviations.append(abs(cents))
        
        # Convertir desviación promedio a score 0-1
        # 0 cents = 1.0, 100 cents = 0.5, 200+ cents = 0.0
        avg_deviation = np.mean(deviations)
        score = max(0.0, 1.0 - (avg_deviation / 200))
        
        return float(score)
    
    def calculate_stability(self, frames: list[PitchFrame]) -> float:
        """
        Calcular estabilidad del pitch (0-1)
        
        Mide qué tan consistente es el pitch a lo largo del tiempo
        """
        valid_frames = [f for f in frames if f.confidence > 0.3 and f.frequency > 0]
        
        if len(valid_frames) < 2:
            return 0.0
        
        frequencies = [f.frequency for f in valid_frames]
        
        # Calcular varianza logarítmica (más significativa para pitch)
        log_freqs = np.log2(np.array(frequencies))
        variance = np.var(log_freqs)
        
        # Convertir varianza a score 0-1
        # Varianza baja = alta estabilidad
        # Usar escala exponencial para penalizar más la inestabilidad
        stability = np.exp(-variance * 10)
        
        return float(min(1.0, stability))
    
    def calculate_smoothed_pitch(
        self,
        frames: list[PitchFrame],
        window_size: int = 5
    ) -> list[float]:
        """
        Suavizar pitch usando media móvil
        
        Útil para visualización
        """
        frequencies = [f.frequency if f.frequency > 0 else np.nan for f in frames]
        
        # Interpolar valores NaN
        frequencies = self._interpolate_nan(frequencies)
        
        # Media móvil
        smoothed = []
        for i in range(len(frequencies)):
            start = max(0, i - window_size // 2)
            end = min(len(frequencies), i + window_size // 2 + 1)
            window = frequencies[start:end]
            smoothed.append(np.nanmean(window))
        
        return smoothed
    
    def _frequency_to_cents(self, frequency: float, target: float) -> float:
        """Calcular desviación en cents respecto al target"""
        if frequency <= 0 or target <= 0:
            return 0.0
        
        cents = 1200 * np.log2(frequency / target)
        return cents
    
    def _interpolate_nan(self, values: list[float]) -> list[float]:
        """Interpolar valores NaN"""
        arr = np.array(values)
        mask = np.isnan(arr)
        
        if not np.any(mask):
            return values
        
        indices = np.arange(len(arr))
        arr[mask] = np.interp(
            indices[mask],
            indices[~mask],
            arr[~mask]
        )
        
        return arr.tolist()
```

### 4. Servicio de Análisis de Pitch

```python
# apps/audio-engine/services/pitch_analysis_service.py
import asyncio
import numpy as np
from typing import Dict, Any, Optional
from ..domain.pitch.torchcrepe_wrapper import TorchCrepePitchDetector, PitchFrame
from ..domain.metrics.pitch_metrics import PitchMetricsCalculator

class PitchAnalysisService:
    """Servicio para análisis completo de pitch"""
    
    def __init__(self, device: str = 'cpu'):
        self.detector = TorchCrepePitchDetector(
            model='full',  # Usar 'full' para análisis profundo
            device=device,
        )
        self.metrics_calculator = PitchMetricsCalculator()
    
    async def analyze_audio(
        self,
        audio_data: np.ndarray,
        sample_rate: int,
        target_note: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Análisis completo de pitch
        
        Returns:
            Diccionario con métricas completas
        """
        # Normalizar audio
        audio_data = self._normalize_audio(audio_data)
        
        # Detectar pitch
        frames = await asyncio.get_event_loop().run_in_executor(
            None,
            self.detector.detect,
            audio_data,
        )
        
        # Calcular métricas
        target_frequency = self._note_to_frequency(target_note) if target_note else None
        
        if target_frequency:
            self.metrics_calculator.target_frequency = target_frequency
        
        accuracy = self.metrics_calculator.calculate_accuracy(frames, target_frequency)
        stability = self.metrics_calculator.calculate_stability(frames)
        
        # Estadísticas adicionales
        valid_frames = [f for f in frames if f.confidence > 0.3 and f.frequency > 0]
        
        frequencies = [f.frequency for f in valid_frames]
        confidences = [f.confidence for f in valid_frames]
        
        stats = {
            'pitch_accuracy': accuracy,
            'pitch_stability': stability,
            'avg_confidence': np.mean(confidences) if confidences else 0.0,
            'detected_notes': self._get_most_common_notes(valid_frames),
            'avg_frequency': np.mean(frequencies) if frequencies else 0.0,
            'min_frequency': min(frequencies) if frequencies else 0.0,
            'max_frequency': max(frequencies) if frequencies else 0.0,
            'total_frames': len(frames),
            'valid_frames': len(valid_frames),
        }
        
        # Si hay target, añadir desviación
        if target_frequency:
            stats['target_frequency'] = target_frequency
            stats['target_note'] = target_note
            stats['avg_cents_deviation'] = self._calculate_avg_deviation(valid_frames, target_frequency)
        
        return stats
    
    def _normalize_audio(self, audio: np.ndarray) -> np.ndarray:
        """Normalizar audio a -1 a 1"""
        max_val = np.max(np.abs(audio))
        if max_val > 0:
            return audio / max_val
        return audio
    
    def _note_to_frequency(self, note: str) -> float:
        """Convertir nota a frecuencia"""
        note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        
        # Parsear nota (ej: "A4", "C#5")
        import re
        match = re.match(r'^([A-G](?:#|b)?)(\d+)$', note)
        
        if not match:
            return 440.0  # Default A4
        
        note_name, octave = match.groups()
        octave = int(octave)
        
        # Índice de nota
        note_index = note_names.index(note_name)
        
        # MIDI number
        midi_number = note_index + (octave + 1) * 12
        
        # Frecuencia
        frequency = 440.0 * (2 ** ((midi_number - 69) / 12))
        
        return frequency
    
    def _get_most_common_notes(self, frames: list[PitchFrame], top_n: int = 3) -> list[Dict]:
        """Obtener notas más comunes"""
        from collections import Counter
        
        notes = [f.note for f in frames if f.note]
        counter = Counter(notes)
        
        return [
            {'note': note, 'count': count, 'percentage': count / len(frames) * 100}
            for note, count in counter.most_common(top_n)
        ]
    
    def _calculate_avg_deviation(self, frames: list[PitchFrame], target_freq: float) -> float:
        """Calcular desviación promedio en cents"""
        deviations = []
        
        for frame in frames:
            if frame.frequency > 0:
                cents = 1200 * np.log2(frame.frequency / target_freq)
                deviations.append(abs(cents))
        
        return np.mean(deviations) if deviations else 0.0
```

### 5. Endpoint de API

```python
# apps/audio-engine/app/api/pitch_analysis.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import numpy as np
import aiofiles

from ..services.pitch_analysis_service import PitchAnalysisService

router = APIRouter()

class PitchAnalysisRequest(BaseModel):
    session_id: str
    task_id: str
    audio_file_path: str
    target_note: Optional[str] = Field(None, pattern=r'^[A-G][#b]?[0-9]$')
    sample_rate: int = Field(default=16000, ge=8000, le=48000)

class PitchAnalysisResponse(BaseModel):
    session_id: str
    task_id: str
    metrics: Dict[str, Any]
    success: bool

@router.post(
    "/analyze-pitch",
    response_model=PitchAnalysisResponse,
    summary="Análisis de pitch con torchcrepe",
)
async def analyze_pitch(
    request: PitchAnalysisRequest,
    pitch_service: PitchAnalysisService = Depends(),
):
    """
    Analiza el pitch de un archivo de audio usando torchcrepe.
    
    - **session_id**: ID de la sesión
    - **task_id**: ID de la tarea
    - **audio_file_path**: Ruta al archivo de audio
    - **target_note**: Nota objetivo (opcional)
    - **sample_rate**: Sample rate del audio
    """
    try:
        # Leer archivo de audio
        async with aiofiles.open(request.audio_file_path, 'rb') as f:
            audio_bytes = await f.read()
        
        # Convertir a numpy array
        # (En producción, usar torchaudio.load())
        audio_data = np.frombuffer(audio_bytes, dtype=np.float32)
        
        # Analizar
        metrics = await pitch_service.analyze_audio(
            audio_data=audio_data,
            sample_rate=request.sample_rate,
            target_note=request.target_note,
        )
        
        return PitchAnalysisResponse(
            session_id=request.session_id,
            task_id=request.task_id,
            metrics=metrics,
            success=True,
        )
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Audio file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
```

## Restricciones

- NO usar modelo 'full' para tiempo real (usar 'tiny')
- NO procesar audio sin normalizar
- NO olvidar manejar casos sin pitch detectado
- NO bloquear el event loop con inferencia
- Siempre verificar disponibilidad de CUDA
- Siempre filtrar frames con baja confianza (< 0.3)
- Siempre manejar errores de inferencia gracefulmente

## Ejemplos

### Bueno: Pipeline Completo de Análisis
```python
# apps/audio-engine/pipelines/pitch_analysis_pipeline.py
import asyncio
from typing import Dict, Any
import numpy as np
import torchaudio

class PitchAnalysisPipeline:
    """Pipeline completo para análisis de pitch"""
    
    def __init__(self, device: str = 'cpu'):
        self.device = device
        self.pitch_service = PitchAnalysisService(device=device)
    
    async def process(
        self,
        audio_path: str,
        target_note: str,
        exercise_type: str,
    ) -> Dict[str, Any]:
        """Procesar audio completo"""
        
        # 1. Cargar audio
        waveform, sample_rate = await self._load_audio(audio_path)
        
        # 2. Preprocesar
        waveform = self._preprocess(waveform, sample_rate)
        
        # 3. Analizar pitch
        pitch_metrics = await self.pitch_service.analyze_audio(
            audio_data=waveform.numpy(),
            sample_rate=sample_rate,
            target_note=target_note,
        )
        
        # 4. Calcular score compuesto
        score = self._calculate_score(pitch_metrics, exercise_type)
        
        return {
            **pitch_metrics,
            'score': score,
            'exercise_type': exercise_type,
            'target_note': target_note,
        }
    
    async def _load_audio(self, path: str) -> tuple:
        """Cargar audio con torchaudio"""
        loop = asyncio.get_event_loop()
        
        def load_sync():
            return torchaudio.load(path)
        
        return await loop.run_in_executor(None, load_sync)
    
    def _preprocess(self, waveform, sample_rate):
        """Preprocesar audio"""
        # Convertir a mono si es stereo
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
        
        # Resamplear a 16kHz si es necesario
        if sample_rate != 16000:
            transform = torchaudio.transforms.Resample(sample_rate, 16000)
            waveform = transform(waveform)
            sample_rate = 16000
        
        # Normalizar
        waveform = waveform / waveform.abs().max()
        
        return waveform.squeeze(0)
    
    def _calculate_score(
        self,
        metrics: Dict[str, Any],
        exercise_type: str
    ) -> int:
        """Calcular score 0-100"""
        
        # Pesos por tipo de ejercicio
        weights = {
            'sustain_note': {
                'pitch_stability': 0.5,
                'pitch_accuracy': 0.3,
                'avg_confidence': 0.2,
            },
            'pitch_target': {
                'pitch_accuracy': 0.6,
                'pitch_stability': 0.2,
                'avg_cents_deviation': 0.2,
            },
        }
        
        exercise_weights = weights.get(exercise_type, weights['sustain_note'])
        
        score = 0.0
        for metric, weight in exercise_weights.items():
            value = metrics.get(metric, 0.0)
            
            # Invertir si es desviación (menor es mejor)
            if 'deviation' in metric:
                value = 1.0 - min(value / 100, 1.0)
            
            score += value * weight
        
        return int(score * 100)
```
