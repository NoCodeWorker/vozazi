---
name: librosa
description: librosa para análisis de características de audio en VOZAZI. Use cuando implemente extracción de features espectrales, análisis temporal, o procesamiento de audio para métricas vocales.
---

# librosa Audio Analysis Skill

Esta skill proporciona experiencia en librosa para extracción de características de audio avanzadas en el audio-engine de VOZAZI.

## Objetivo

Implementar extracción completa de features de audio usando librosa para análisis espectral, temporal y de timbre en VOZAZI.

## Instrucciones

### 1. Configuración e Instalación

```bash
# requirements.txt
librosa>=0.10.0
numpy>=1.24.0
scipy>=1.11.0
soundfile>=0.12.0
```

```python
# apps/audio-engine/domain/audio/librosa_wrapper.py
import librosa
import numpy as np
from typing import Dict, Any, Optional, Tuple
from dataclasses import dataclass

@dataclass
class AudioFeatures:
    """Características extraídas de audio"""
    # Features espectrales
    spectral_centroid: np.ndarray
    spectral_bandwidth: np.ndarray
    spectral_contrast: np.ndarray
    spectral_rolloff: np.ndarray
    mfccs: np.ndarray
    
    # Features temporales
    zero_crossing_rate: np.ndarray
    rms_energy: np.ndarray
    onset_strength: np.ndarray
    
    # Features derivados
    chroma: np.ndarray
    tempo: float
    key: Optional[str]

class LibrosaFeatureExtractor:
    """Wrapper para extracción de features con librosa"""
    
    def __init__(
        self,
        sample_rate: int = 16000,
        n_mfcc: int = 13,
        hop_length: int = 512,
    ):
        self.sample_rate = sample_rate
        self.n_mfcc = n_mfcc
        self.hop_length = hop_length
    
    def extract_all_features(
        self,
        audio: np.ndarray,
        y: Optional[np.ndarray] = None
    ) -> AudioFeatures:
        """
        Extraer todas las características de audio
        
        Args:
            audio: Audio cargado (ya normalizado)
            y: Opcional, audio crudo para algunas features
            
        Returns:
            AudioFeatures con todas las características
        """
        # Asegurar sample rate correcto
        if y is None:
            y = audio
        
        # Features espectrales
        spectral_centroid = librosa.feature.spectral_centroid(
            y=y, sr=self.sample_rate, hop_length=self.hop_length
        )[0]
        
        spectral_bandwidth = librosa.feature.spectral_bandwidth(
            y=y, sr=self.sample_rate, hop_length=self.hop_length
        )[0]
        
        spectral_contrast = librosa.feature.spectral_contrast(
            y=y, sr=self.sample_rate, hop_length=self.hop_length
        )
        
        spectral_rolloff = librosa.feature.spectral_rolloff(
            y=y, sr=self.sample_rate, hop_length=self.hop_length
        )[0]
        
        # MFCCs (Mel-frequency cepstral coefficients)
        mfccs = librosa.feature.mfcc(
            y=y, sr=self.sample_rate, n_mfcc=self.n_mfcc, hop_length=self.hop_length
        )
        
        # Features temporales
        zero_crossing_rate = librosa.feature.zero_crossing_rate(
            y, hop_length=self.hop_length
        )[0]
        
        rms_energy = librosa.feature.rms(
            y=y, hop_length=self.hop_length
        )[0]
        
        onset_strength = librosa.onset.onset_strength(
            y=y, sr=self.sample_rate, hop_length=self.hop_length
        )
        
        # Chroma (para análisis de tonalidad)
        chroma = librosa.feature.chroma_stft(
            y=y, sr=self.sample_rate, hop_length=self.hop_length
        )
        
        # Tempo
        tempo, _ = librosa.beat.beat_track(
            y=y, sr=self.sample_rate
        )
        
        # Estimación de tonalidad (key)
        key = self._estimate_key(chroma)
        
        return AudioFeatures(
            spectral_centroid=spectral_centroid,
            spectral_bandwidth=spectral_bandwidth,
            spectral_contrast=spectral_contrast,
            spectral_rolloff=spectral_rolloff,
            mfccs=mfccs,
            zero_crossing_rate=zero_crossing_rate,
            rms_energy=rms_energy,
            onset_strength=onset_strength,
            chroma=chroma,
            tempo=tempo if isinstance(tempo, float) else float(tempo[0]),
            key=key,
        )
    
    def _estimate_key(self, chroma: np.ndarray) -> str:
        """Estimar tonalidad desde chroma features"""
        # Sumar chroma a lo largo del tiempo
        chroma_sum = np.sum(chroma, axis=1)
        
        # Nombres de notas
        note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        
        # Encontrar nota con mayor energía
        max_idx = np.argmax(chroma_sum)
        
        return note_names[max_idx]
```

### 2. Carga y Preprocesamiento de Audio

```python
# apps/audio-engine/domain/audio/audio_loader.py
import librosa
import numpy as np
from typing import Tuple, Optional
import soundfile as sf

class AudioLoader:
    """Carga y preprocesamiento de audio optimizado"""
    
    @staticmethod
    def load(
        file_path: str,
        target_sr: int = 16000,
        mono: bool = True,
        offset: float = 0.0,
        duration: Optional[float] = None,
    ) -> Tuple[np.ndarray, int]:
        """
        Cargar archivo de audio
        
        Args:
            file_path: Ruta al archivo
            target_sr: Sample rate objetivo
            mono: Convertir a mono
            offset: Inicio en segundos
            duration: Duración máxima a cargar
            
        Returns:
            (audio, sample_rate)
        """
        y, sr = librosa.load(
            file_path,
            sr=target_sr,
            mono=mono,
            offset=offset,
            duration=duration,
        )
        
        return y, sr
    
    @staticmethod
    def load_from_bytes(
        audio_bytes: bytes,
        target_sr: int = 16000,
    ) -> np.ndarray:
        """Cargar audio desde bytes"""
        import io
        
        # Usar soundfile para leer desde bytes
        audio_io = io.BytesIO(audio_bytes)
        y, sr = sf.read(audio_io, dtype='float32')
        
        # Convertir a mono si es necesario
        if len(y.shape) > 1:
            y = y.mean(axis=1)
        
        # Resamplear si es necesario
        if sr != target_sr:
            y = librosa.resample(y, orig_sr=sr, target_sr=target_sr)
        
        return y
    
    @staticmethod
    def normalize(
        audio: np.ndarray,
        target_db: float = -20.0,
    ) -> np.ndarray:
        """
        Normalizar audio a nivel dB objetivo
        
        Args:
            audio: Audio de entrada
            target_db: Nivel objetivo en dB
            
        Returns:
            Audio normalizado
        """
        # Calcular RMS actual
        rms = np.sqrt(np.mean(audio ** 2))
        
        # Evitar división por cero
        if rms < 1e-10:
            return audio
        
        # Calcular factor de normalización
        current_db = 20 * np.log10(rms)
        gain_db = target_db - current_db
        gain_linear = 10 ** (gain_db / 20)
        
        return audio * gain_linear
    
    @staticmethod
    def trim_silence(
        audio: np.ndarray,
        top_db: float = 30,
    ) -> Tuple[np.ndarray, int, int]:
        """
        Recortar silencio del inicio y fin
        
        Returns:
            (audio_trimmed, start_sample, end_sample)
        """
        trimmed, index = librosa.effects.trim(
            audio,
            top_db=top_db,
            frame_length=2048,
            hop_length=512,
        )
        
        return trimmed, index[0], index[1]
    
    @staticmethod
    def split_into_chunks(
        audio: np.ndarray,
        chunk_duration_ms: int = 1000,
        hop_duration_ms: int = 500,
        sample_rate: int = 16000,
    ) -> list[np.ndarray]:
        """
        Dividir audio en chunks solapados
        
        Args:
            audio: Audio completo
            chunk_duration_ms: Duración de cada chunk en ms
            hop_duration_ms: Salto entre chunks en ms
            
        Returns:
            Lista de chunks
        """
        chunk_samples = int(sample_rate * chunk_duration_ms / 1000)
        hop_samples = int(sample_rate * hop_duration_ms / 1000)
        
        chunks = []
        start = 0
        
        while start + chunk_samples <= len(audio):
            chunk = audio[start:start + chunk_samples]
            chunks.append(chunk)
            start += hop_samples
        
        # Añadir último chunk si queda audio
        if start < len(audio):
            last_chunk = audio[start:]
            # Padding si es necesario
            if len(last_chunk) < chunk_samples:
                padding = np.zeros(chunk_samples - len(last_chunk))
                last_chunk = np.concatenate([last_chunk, padding])
            chunks.append(last_chunk)
        
        return chunks
```

### 3. Análisis de Formantes y Resonancia

```python
# apps/audio-engine/domain/audio/formant_analysis.py
import numpy as np
import librosa
from scipy import signal
from typing import List, Tuple

class FormantAnalyzer:
    """Análisis de formantes vocales"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.preemphasis = 0.97
    
    def extract_formants(
        self,
        audio: np.ndarray,
        num_formants: int = 4,
    ) -> List[Tuple[float, float, float]]:
        """
        Extraer formantes (F1, F2, F3, F4)
        
        Returns:
            Lista de (frecuencia, ancho_banda, amplitud) por formante
        """
        # Pre-énfasis
        audio = np.append(audio[0], audio[1:] - self.preemphasis * audio[:-1])
        
        # Ventana de análisis (usar frame central)
        frame_size = int(0.025 * self.sample_rate)  # 25ms
        start = len(audio) // 2 - frame_size // 2
        frame = audio[start:start + frame_size]
        
        # Aplicar ventana de Hamming
        windowed = frame * np.hamming(frame_size)
        
        # Calcular LPC (Linear Predictive Coding)
        lpc_coeffs = self._compute_lpc(windowed, num_formants * 2)
        
        # Encontrar raíces del polinomio LPC
        roots = np.roots(lpc_coeffs)
        
        # Filtrar raíces (solo las del círculo unitario superior)
        roots = roots[np.imag(roots) > 0]
        
        # Calcular frecuencias de formantes
        angles = np.arctan2(np.imag(roots), np.real(roots))
        frequencies = angles * self.sample_rate / (2 * np.pi)
        
        # Calcular anchos de banda
        magnitudes = np.abs(roots)
        bandwidths = -0.5 * self.sample_rate * np.log(magnitudes) / np.pi
        
        # Ordenar por frecuencia y tomar las primeras num_formants
        sorted_indices = np.argsort(frequencies)
        frequencies = frequencies[sorted_indices]
        bandwidths = bandwidths[sorted_indices]
        
        # Filtrar formantes válidos (50-5000 Hz para voz)
        valid_mask = (frequencies > 50) & (frequencies < 5000)
        frequencies = frequencies[valid_mask]
        bandwidths = bandwidths[valid_mask]
        
        # Calcular amplitudes desde espectro
        fft = np.fft.fft(windowed)
        freqs = np.fft.fftfreq(len(windowed), 1/self.sample_rate)
        amplitudes = np.abs(fft[:len(fft)//2])
        
        formants = []
        for freq, bw in zip(frequencies[:num_formants], bandwidths[:num_formants]):
            freq_idx = int(freq / self.sample_rate * len(amplitudes))
            amp = float(amplitudes[freq_idx]) if freq_idx < len(amplitudes) else 0.0
            
            formants.append((float(freq), float(bw), amp))
        
        return formants
    
    def _compute_lpc(self, audio: np.ndarray, order: int) -> np.ndarray:
        """Calcular coeficientes LPC"""
        # Autocorrelación
        autocorr = np.correlate(audio, audio, mode='full')
        autocorr = autocurr[len(autocorr)//2:]
        
        # Resolver ecuaciones de Yule-Walker
        R = np.zeros((order, order))
        for i in range(order):
            for j in range(order):
                R[i, j] = autocorr[abs(i - j)]
        
        r = autocorr[1:order + 1]
        
        # Resolver sistema lineal
        try:
            coeffs = np.linalg.solve(R, r)
        except np.linalg.LinAlgError:
            coeffs = np.zeros(order)
        
        # Añadir coeficiente a0 = 1
        return np.concatenate([[1], -coeffs])
    
    def calculate_resonance_balance(
        self,
        formants: List[Tuple[float, float, float]],
    ) -> float:
        """
        Calcular balance de resonancia (0-1)
        
        Compara energía de formantes bajos vs altos
        """
        if len(formants) < 2:
            return 0.5
        
        # Separar formantes bajos (F1, F2) y altos (F3, F4)
        low_energy = sum(f[2] for f in formants[:2])
        high_energy = sum(f[2] for f in formants[2:])
        
        if low_energy + high_energy < 1e-10:
            return 0.5
        
        # Balance ideal: más energía en formantes altos = mejor resonancia
        balance = high_energy / (low_energy + high_energy)
        
        return float(min(1.0, balance * 2))  # Escalar para que 0.5 sea "neutral"
```

### 4. Detección de Onset y Ataque

```python
# apps/audio-engine/domain/audio/onset_detection.py
import numpy as np
import librosa
from typing import List, Dict, Any

class OnsetDetector:
    """Detección de onset (inicio de nota)"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
    
    def detect_onsets(
        self,
        audio: np.ndarray,
        threshold: float = 0.5,
        min_delay_ms: int = 20,
    ) -> List[Dict[str, Any]]:
        """
        Detectar onsets en el audio
        
        Returns:
            Lista de onsets con tiempo, fuerza y características
        """
        # Calcular onset strength
        onset_env = librosa.onset.onset_strength(
            y=audio,
            sr=self.sample_rate,
            hop_length=512,
        )
        
        # Detectar picos
        onset_frames = librosa.onset.onset_detect(
            onset_envelope=onset_env,
            sr=self.sample_rate,
            hop_length=512,
            backtrack=True,
        )
        
        # Convertir frames a tiempos
        onset_times = librosa.frames_to_time(
            onset_frames,
            sr=self.sample_rate,
            hop_length=512,
        )
        
        # Extraer características por onset
        onsets = []
        for i, (frame, time) in enumerate(zip(onset_frames, onset_times)):
            # Fuerza del onset
            strength = float(onset_env[frame]) if frame < len(onset_env) else 0.0
            
            # Características adicionales
            onset_data = {
                'time': float(time),
                'frame': int(frame),
                'strength': strength,
                'index': i,
            }
            
            onsets.append(onset_data)
        
        return onsets
    
    def calculate_onset_timing(
        self,
        onsets: List[Dict[str, Any]],
        expected_onsets: List[float],
    ) -> float:
        """
        Calcular precisión de timing de onsets
        
        Compara onsets detectados con esperados
        
        Returns:
            Score 0-1 (1 = perfecto)
        """
        if not onsets or not expected_onsets:
            return 0.0
        
        # Matching greedy de onsets
        detected_times = [o['time'] for o in onsets]
        
        errors = []
        for expected in expected_onsets:
            # Encontrar onset detectado más cercano
            if detected_times:
                closest = min(detected_times, key=lambda t: abs(t - expected))
                error_ms = abs(closest - expected) * 1000  # Convertir a ms
                errors.append(error_ms)
                detected_times.remove(closest)
        
        if not errors:
            return 0.0
        
        # Convertir error promedio a score
        # 0ms = 1.0, 100ms = 0.5, 200ms+ = 0.0
        avg_error = np.mean(errors)
        score = max(0.0, 1.0 - (avg_error / 200))
        
        return float(score)
    
    def analyze_attack_quality(
        self,
        audio: np.ndarray,
        onset_time: float,
        window_ms: int = 100,
    ) -> Dict[str, float]:
        """
        Analizar calidad del ataque vocal
        
        Args:
            audio: Audio completo
            onset_time: Tiempo del onset en segundos
            window_ms: Ventana de análisis en ms
            
        Returns:
            Diccionario con métricas de ataque
        """
        # Convertir a samples
        onset_sample = int(onset_time * self.sample_rate)
        window_samples = int(self.sample_rate * window_ms / 1000)
        
        # Extraer ventana alrededor del onset
        start = max(0, onset_sample - window_samples)
        end = min(len(audio), onset_sample + window_samples)
        window = audio[start:end]
        
        # Calcular características
        rms = np.sqrt(np.mean(window ** 2))
        zcr = librosa.feature.zero_crossing_rate(window)[0, 0]
        
        # Calcular pendiente de ataque (rise time)
        envelope = np.abs(window)
        peak_idx = np.argmax(envelope)
        
        if peak_idx > 0:
            rise_time = peak_idx / self.sample_rate * 1000  # ms
            attack_slope = envelope[peak_idx] / (peak_idx + 1)
        else:
            rise_time = 0.0
            attack_slope = 0.0
        
        return {
            'rms_energy': float(rms),
            'zero_crossing_rate': float(zcr),
            'rise_time_ms': float(rise_time),
            'attack_slope': float(attack_slope),
            'peak_amplitude': float(np.max(envelope)),
        }
```

### 5. Servicio de Extracción de Features

```python
# apps/audio-engine/services/feature_extraction_service.py
import numpy as np
from typing import Dict, Any, Optional
from ..domain.audio.librosa_wrapper import LibrosaFeatureExtractor, AudioFeatures
from ..domain.audio.formant_analysis import FormantAnalyzer
from ..domain.audio.onset_detection import OnsetDetector

class FeatureExtractionService:
    """Servicio completo para extracción de features de audio"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.feature_extractor = LibrosaFeatureExtractor(sample_rate=sample_rate)
        self.formant_analyzer = FormantAnalyzer(sample_rate=sample_rate)
        self.onset_detector = OnsetDetector(sample_rate=sample_rate)
    
    def extract_vocal_features(
        self,
        audio: np.ndarray,
        target_note: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Extraer características vocales completas
        
        Returns:
            Diccionario con todas las características relevantes para VOZAZI
        """
        # 1. Extraer features espectrales
        features = self.feature_extractor.extract_all_features(audio)
        
        # 2. Extraer formantes
        formants = self.formant_analyzer.extract_formants(audio)
        resonance_balance = self.formant_analyzer.calculate_resonance_balance(formants)
        
        # 3. Detectar onsets
        onsets = self.onset_detector.detect_onsets(audio)
        
        # 4. Calcular métricas agregadas
        metrics = self._aggregate_features(features, formants, onsets)
        
        # 5. Añadir metadata
        metrics['duration_seconds'] = len(audio) / self.sample_rate
        metrics['sample_rate'] = self.sample_rate
        metrics['detected_key'] = features.key
        metrics['detected_tempo'] = features.tempo
        metrics['num_formants'] = len(formants)
        metrics['num_onsets'] = len(onsets)
        
        # 6. Si hay nota objetivo, calcular desviación
        if target_note:
            from ..domain.pitch.torchcrepe_wrapper import TorchCrepePitchDetector
            
            detector = TorchCrepePitchDetector(sample_rate=self.sample_rate)
            frames = detector.detect(audio)
            
            valid_frames = [f for f in frames if f.frequency > 0 and f.confidence > 0.3]
            
            if valid_frames:
                avg_freq = np.mean([f.frequency for f in valid_frames])
                target_freq = self._note_to_frequency(target_note)
                
                cents_deviation = 1200 * np.log2(avg_freq / target_freq)
                
                metrics['target_note'] = target_note
                metrics['target_frequency'] = target_freq
                metrics['avg_frequency'] = avg_freq
                metrics['cents_deviation'] = float(cents_deviation)
        
        return metrics
    
    def _aggregate_features(
        self,
        features: AudioFeatures,
        formants: list,
        onsets: list,
    ) -> Dict[str, float]:
        """Agregar features a métricas escalares"""
        
        return {
            # Espectrales
            'avg_spectral_centroid': float(np.mean(features.spectral_centroid)),
            'avg_spectral_bandwidth': float(np.mean(features.spectral_bandwidth)),
            'avg_spectral_rolloff': float(np.mean(features.spectral_rolloff)),
            
            # MFCCs (promedio por coeficiente)
            **{
                f'mfcc_{i}': float(np.mean(features.mfccs[i]))
                for i in range(min(5, features.mfccs.shape[0]))
            },
            
            # Temporales
            'avg_zero_crossing_rate': float(np.mean(features.zero_crossing_rate)),
            'avg_rms_energy': float(np.mean(features.rms_energy)),
            
            # Formantes
            'f1_frequency': formants[0][0] if len(formants) > 0 else 0.0,
            'f2_frequency': formants[1][0] if len(formants) > 1 else 0.0,
            'resonance_balance': float(np.mean([f[2] for f in formants])) if formants else 0.0,
            
            # Onsets
            'onset_count': len(onsets),
            'avg_onset_strength': float(np.mean([o['strength'] for o in onsets])) if onsets else 0.0,
        }
    
    def _note_to_frequency(self, note: str) -> float:
        """Convertir nota a frecuencia"""
        note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        
        import re
        match = re.match(r'^([A-G](?:#|b)?)(\d+)$', note)
        
        if not match:
            return 440.0
        
        note_name, octave = match.groups()
        octave = int(octave)
        
        note_index = note_names.index(note_name)
        midi_number = note_index + (octave + 1) * 12
        
        frequency = 440.0 * (2 ** ((midi_number - 69) / 12))
        
        return frequency
```

### 6. Endpoint de API

```python
# apps/audio-engine/app/api/features.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import numpy as np
import aiofiles

from ..services.feature_extraction_service import FeatureExtractionService

router = APIRouter()

class FeatureExtractionRequest(BaseModel):
    session_id: str
    task_id: str
    audio_file_path: str
    target_note: Optional[str] = None

class FeatureExtractionResponse(BaseModel):
    session_id: str
    task_id: str
    features: Dict[str, Any]
    success: bool

@router.post(
    "/extract-features",
    response_model=FeatureExtractionResponse,
    summary="Extracción de features de audio con librosa",
)
async def extract_features(
    request: FeatureExtractionRequest,
    feature_service: FeatureExtractionService = Depends(),
):
    """
    Extrae características completas de audio usando librosa.
    
    Incluye:
    - Features espectrales (centroid, bandwidth, contrast, rolloff)
    - MFCCs
    - Features temporales (ZCR, RMS, onset strength)
    - Formantes y resonancia
    - Detección de onsets
    """
    try:
        # Leer audio
        async with aiofiles.open(request.audio_file_path, 'rb') as f:
            audio_bytes = await f.read()
        
        # Convertir a numpy
        audio = np.frombuffer(audio_bytes, dtype=np.float32)
        
        # Extraer features
        features = await asyncio.get_event_loop().run_in_executor(
            None,
            feature_service.extract_vocal_features,
            audio,
            request.target_note,
        )
        
        return FeatureExtractionResponse(
            session_id=request.session_id,
            task_id=request.task_id,
            features=features,
            success=True,
        )
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Audio file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature extraction failed: {str(e)}")
```

## Restricciones

- NO cargar audio sin verificar sample rate
- NO usar ventanas muy cortas (< 20ms) para análisis espectral
- NO olvidar normalizar audio antes de extraer features
- NO bloquear event loop con procesamiento pesado
- Siempre manejar archivos corruptos o vacíos
- Siempre verificar que hay audio suficiente para análisis
- Siempre validar que los formantes estén en rango vocal (50-5000 Hz)

## Ejemplos

### Bueno: Pipeline Completo de Análisis
```python
# apps/audio-engine/pipelines/full_audio_analysis.py
import asyncio
from typing import Dict, Any
import numpy as np
import librosa

class FullAudioAnalysisPipeline:
    """Pipeline completo de análisis de audio"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.feature_service = FeatureExtractionService(sample_rate=sample_rate)
        self.pitch_service = PitchAnalysisService()
    
    async def analyze(
        self,
        audio_path: str,
        exercise_type: str,
        target_note: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Análisis completo"""
        
        # 1. Cargar audio
        y, sr = await self._load_audio(audio_path)
        
        # 2. Preprocesar
        y = self._preprocess(y, sr)
        
        # 3. Extraer features en paralelo
        features_task = asyncio.get_event_loop().run_in_executor(
            None,
            self.feature_service.extract_vocal_features,
            y,
            target_note,
        )
        
        pitch_task = asyncio.get_event_loop().run_in_executor(
            None,
            self._analyze_pitch,
            y,
            target_note,
        )
        
        features, pitch_metrics = await asyncio.gather(features_task, pitch_task)
        
        # 4. Calcular score compuesto
        score = self._calculate_score(
            features,
            pitch_metrics,
            exercise_type,
        )
        
        return {
            **features,
            **pitch_metrics,
            'score': score,
            'exercise_type': exercise_type,
        }
    
    async def _load_audio(self, path: str):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            lambda: librosa.load(path, sr=self.sample_rate)
        )
    
    def _preprocess(self, y: np.ndarray, sr: int) -> np.ndarray:
        # Trim silence
        y_trimmed, _, _ = librosa.effects.trim(y, top_db=30)
        
        # Normalize
        y_norm = y_trimmed / np.max(np.abs(y_trimmed))
        
        return y_norm
    
    def _analyze_pitch(self, y: np.ndarray, target_note: Optional[str]) -> Dict[str, Any]:
        return self.pitch_service.analyze_audio(y, self.sample_rate, target_note)
    
    def _calculate_score(
        self,
        features: Dict[str, Any],
        pitch: Dict[str, Any],
        exercise_type: str,
    ) -> int:
        # Pesos por tipo de ejercicio
        weights = {
            'sustain_note': {
                'pitch_stability': 0.4,
                'resonance_balance': 0.2,
                'pitch_accuracy': 0.3,
                'avg_rms_energy': 0.1,
            },
            'clean_onset': {
                'onset_timing': 0.4,
                'pitch_accuracy': 0.3,
                'attack_slope': 0.2,
                'pitch_stability': 0.1,
            },
        }
        
        exercise_weights = weights.get(exercise_type, weights['sustain_note'])
        
        score = 0.0
        for metric, weight in exercise_weights.items():
            value = features.get(metric, pitch.get(metric, 0.0))
            
            # Normalizar si es necesario
            if metric == 'avg_rms_energy':
                value = min(1.0, value * 10)
            elif metric == 'attack_slope':
                value = min(1.0, value * 1000)
            
            score += value * weight
        
        return int(score * 100)
```
