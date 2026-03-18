---
name: torchaudio
description: torchaudio para carga y transformación de audio en VOZAZI. Use cuando implemente carga de archivos, resampling, spectrograms, o transformadas de audio.
---

# torchaudio Skill

Esta skill proporciona experiencia en torchaudio para carga, transformación y procesamiento de audio en el audio-engine de VOZAZI.

## Objetivo

Implementar carga eficiente de audio, transformaciones de señal y extracción de características usando torchaudio para el pipeline de análisis vocal.

## Instrucciones

### 1. Carga de Audio

```python
# apps/audio-engine/domain/audio/audio_loader.py
import torchaudio
import torch
from typing import Tuple, Optional, Union
from pathlib import Path

class TorchAudioLoader:
    """Carga de audio optimizada con torchaudio"""
    
    @staticmethod
    def load(
        file_path: Union[str, Path],
        sample_rate: Optional[int] = None,
        normalize: bool = True,
        channels_first: bool = True,
    ) -> Tuple[torch.Tensor, int]:
        """
        Cargar archivo de audio
        
        Args:
            file_path: Ruta al archivo
            sample_rate: Sample rate objetivo (resample si es diferente)
            normalize: Normalizar a [-1, 1]
            channels_first: Formato (channels, time) vs (time, channels)
            
        Returns:
            (waveform, sample_rate)
        """
        waveform, sr = torchaudio.load(
            str(file_path),
            normalize=normalize,
            channels_first=channels_first,
        )
        
        # Resample si es necesario
        if sample_rate and sr != sample_rate:
            waveform = torchaudio.functional.resample(
                waveform,
                orig_freq=sr,
                new_freq=sample_rate,
            )
            sr = sample_rate
        
        return waveform, sr
    
    @staticmethod
    def load_to_mono(
        file_path: Union[str, Path],
        sample_rate: int = 16000,
    ) -> torch.Tensor:
        """Cargar y convertir a mono"""
        waveform, sr = torchaudio.load(str(file_path))
        
        # Convertir a mono si es stereo
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
        
        # Resample
        if sr != sample_rate:
            waveform = torchaudio.functional.resample(
                waveform,
                orig_freq=sr,
                new_freq=sample_rate,
            )
        
        return waveform.squeeze(0)
    
    @staticmethod
    async def load_async(
        file_path: Union[str, Path],
        sample_rate: Optional[int] = None,
    ) -> Tuple[torch.Tensor, int]:
        """Carga asíncrona para no bloquear"""
        import asyncio
        
        loop = asyncio.get_event_loop()
        
        def load_sync():
            return TorchAudioLoader.load(file_path, sample_rate)
        
        return await loop.run_in_executor(None, load_sync)
```

### 2. Transformaciones de Audio

```python
# apps/audio-engine/domain/audio/audio_transforms.py
import torch
import torchaudio
import torchaudio.transforms as T
from typing import Optional

class AudioTransforms:
    """Transformaciones de audio con torchaudio"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
    
    def create_resampler(
        self,
        orig_sr: int,
        new_sr: int,
    ) -> T.Resample:
        """Crear transform de resampling"""
        return T.Resample(orig_freq=orig_sr, new_freq=new_sr)
    
    def create_spectrogram(
        self,
        n_fft: int = 2048,
        hop_length: Optional[int] = None,
        win_length: Optional[int] = None,
        pad: int = 0,
        power: Optional[float] = 2.0,
        normalized: bool = False,
    ) -> T.Spectrogram:
        """
        Crear transform de espectrograma
        
        Args:
            n_fft: Tamaño de FFT
            hop_length: Salto entre frames
            win_length: Tamaño de ventana
            power: Exponente (2.0 = power spectrogram, None = complex)
            normalized: Normalizar por ventana
        """
        return T.Spectrogram(
            n_fft=n_fft,
            hop_length=hop_length or n_fft // 4,
            win_length=win_length or n_fft,
            pad=pad,
            power=power,
            normalized=normalized,
        )
    
    def create_mel_spectrogram(
        self,
        sample_rate: int = 16000,
        n_fft: int = 2048,
        n_mels: int = 128,
        hop_length: Optional[int] = None,
        f_min: float = 0.0,
        f_max: Optional[float] = None,
    ) -> T.MelSpectrogram:
        """
        Crear Mel espectrograma
        
        Args:
            n_mels: Número de bandas Mel
            f_min: Frecuencia mínima
            f_max: Frecuencia máxima
        """
        return T.MelSpectrogram(
            sample_rate=sample_rate,
            n_fft=n_fft,
            n_mels=n_mels,
            hop_length=hop_length or n_fft // 4,
            f_min=f_min,
            f_max=f_max or sample_rate / 2,
        )
    
    def create_mfcc(
        self,
        sample_rate: int = 16000,
        n_mfcc: int = 40,
        melkwargs: Optional[dict] = None,
    ) -> T.MFCC:
        """Crear transform MFCC"""
        return T.MFCC(
            sample_rate=sample_rate,
            n_mfcc=n_mfcc,
            melkwargs=melkwargs or {'n_mels': 128, 'hop_length': 512},
        )
    
    def create_amplitude_to_db(self) -> T.AmplitudeToDB:
        """Convertir amplitud a escala dB"""
        return T.AmplitudeToDB(stype='power', top_db=80.0)
    
    def create_time_stretch(
        self,
        fixed_rate: Optional[float] = None,
    ) -> T.TimeStretch:
        """Time stretching sin cambiar pitch"""
        return T.TimeStretch(fixed_rate=fixed_rate)
    
    def create_pitch_shift(
        self,
        sample_rate: int,
        n_steps: int,
    ) -> T.PitchShift:
        """Pitch shift sin cambiar tempo"""
        return T.PitchShift(sample_rate=sample_rate, n_steps=n_steps)
```

### 3. Extracción de Características

```python
# apps/audio-engine/domain/audio/feature_extraction.py
import torch
import torchaudio
import torchaudio.functional as F
from typing import Dict, Any

class TorchAudioFeatureExtractor:
    """Extracción de features con torchaudio"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
    
    def extract_spectral_features(
        self,
        waveform: torch.Tensor,
        n_fft: int = 2048,
    ) -> Dict[str, torch.Tensor]:
        """
        Extraer características espectrales
        
        Returns:
            Diccionario con spectral centroid, bandwidth, contrast, rolloff
        """
        # Spectrogram
        spec = F.spectrogram(waveform, n_fft=n_fft, hop_length=n_fft//4, power=2.0)
        
        # Spectral Centroid
        centroid = F.spectral_centroid(waveform, sample_rate=self.sample_rate)
        
        # Spectral Bandwidth
        bandwidth = F.spectral_bandwidth(spec, sample_rate=self.sample_rate)
        
        # Spectral Rolloff
        rolloff = F.spectral_rolloff(spec, sample_rate=self.sample_rate)
        
        # Spectral Contrast (implementación manual)
        contrast = self._spectral_contrast(spec)
        
        return {
            'spectrogram': spec,
            'spectral_centroid': centroid,
            'spectral_bandwidth': bandwidth,
            'spectral_rolloff': rolloff,
            'spectral_contrast': contrast,
        }
    
    def extract_mfcc_features(
        self,
        waveform: torch.Tensor,
        n_mfcc: int = 40,
    ) -> torch.Tensor:
        """Extraer MFCCs"""
        mfcc_transform = torchaudio.transforms.MFCC(
            sample_rate=self.sample_rate,
            n_mfcc=n_mfcc,
            melkwargs={'n_mels': 128, 'hop_length': 512},
        )
        
        return mfcc_transform(waveform)
    
    def extract_chroma_features(
        self,
        waveform: torch.Tensor,
    ) -> torch.Tensor:
        """Extraer chroma features (tonalidad)"""
        chroma = torchaudio.transforms.ChromaSTFT(
            sample_rate=self.sample_rate,
        )
        
        return chroma(waveform)
    
    def _spectral_contrast(
        self,
        spec: torch.Tensor,
        num_bands: int = 6,
    ) -> torch.Tensor:
        """Calcular spectral contrast"""
        # Implementación simplificada
        bands = torch.chunk(spec, num_bands, dim=1)
        
        contrasts = []
        for band in bands:
            peak = band.max(dim=1, keepdim=True)[0]
            valley = band.min(dim=1, keepdim=True)[0]
            contrast = peak - valley
            contrasts.append(contrast)
        
        return torch.cat(contrasts, dim=1)
    
    def extract_all_features(
        self,
        waveform: torch.Tensor,
    ) -> Dict[str, Any]:
        """Extraer todas las características"""
        features = {}
        
        # Espectrales
        spectral = self.extract_spectral_features(waveform)
        features.update(spectral)
        
        # MFCCs
        features['mfcc'] = self.extract_mfcc_features(waveform)
        
        # Chroma
        features['chroma'] = self.extract_chroma_features(waveform)
        
        # RMS Energy
        features['rms'] = self._extract_rms(waveform)
        
        # Zero Crossing Rate
        features['zcr'] = self._extract_zcr(waveform)
        
        return features
    
    def _extract_rms(self, waveform: torch.Tensor) -> torch.Tensor:
        """Extraer RMS energy"""
        return torch.sqrt(torch.mean(waveform ** 2, dim=-1, keepdim=True))
    
    def _extract_zcr(self, waveform: torch.Tensor) -> torch.Tensor:
        """Extraer Zero Crossing Rate"""
        return F.zero_crossing_rate(waveform)
```

### 4. Pipeline de Preprocesamiento

```python
# apps/audio-engine/pipelines/audio_preprocessing.py
import torch
import torchaudio
from typing import Tuple, Optional

class AudioPreprocessingPipeline:
    """Pipeline completo de preprocesamiento"""
    
    def __init__(
        self,
        target_sample_rate: int = 16000,
        target_duration: Optional[float] = None,
        normalize: bool = True,
        trim_silence: bool = True,
    ):
        self.target_sr = target_sample_rate
        self.target_duration = target_duration
        self.normalize = normalize
        self.trim_silence = trim_silence
    
    def process(
        self,
        file_path: str,
    ) -> torch.Tensor:
        """
        Preprocesar archivo de audio completo
        
        Returns:
            Waveform preprocesado
        """
        # 1. Cargar
        waveform, sr = torchaudio.load(file_path)
        
        # 2. Convertir a mono
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
        
        # 3. Resample
        if sr != self.target_sr:
            waveform = torchaudio.functional.resample(
                waveform,
                orig_freq=sr,
                new_freq=self.target_sr,
            )
        
        # 4. Trim silence
        if self.trim_silence:
            waveform = self._trim_silence(waveform)
        
        # 5. Normalizar
        if self.normalize:
            waveform = self._normalize(waveform)
        
        # 6. Recortar a duración objetivo
        if self.target_duration:
            waveform = self._crop_to_duration(waveform)
        
        return waveform.squeeze(0)
    
    def _trim_silence(
        self,
        waveform: torch.Tensor,
        top_db: float = 30,
    ) -> torch.Tensor:
        """Recortar silencio del inicio y fin"""
        # Calcular energía por frame
        frame_energy = waveform ** 2
        
        # Umbral
        threshold = frame_energy.max() * (10 ** (-top_db / 10))
        
        # Encontrar regiones no silenciosas
        non_silent = frame_energy > threshold
        
        # Encontrar índices
        non_zero = non_silent.nonzero()
        
        if len(non_zero) == 0:
            return waveform
        
        start = non_zero[0].item()
        end = non_zero[-1].item() + 1
        
        return waveform[:, start:end]
    
    def _normalize(self, waveform: torch.Tensor) -> torch.Tensor:
        """Normalizar a [-1, 1]"""
        max_val = waveform.abs().max()
        if max_val > 0:
            waveform = waveform / max_val
        return waveform
    
    def _crop_to_duration(
        self,
        waveform: torch.Tensor,
    ) -> torch.Tensor:
        """Recortar a duración objetivo"""
        target_samples = int(self.target_duration * self.target_sr)
        
        if waveform.shape[-1] > target_samples:
            # Crop desde el inicio
            waveform = waveform[:, :target_samples]
        elif waveform.shape[-1] < target_samples:
            # Padding al final
            padding = target_samples - waveform.shape[-1]
            waveform = torch.nn.functional.pad(
                waveform,
                (0, padding),
                mode='constant',
                value=0,
            )
        
        return waveform
```

### 5. Data Augmentation para Audio

```python
# apps/audio-engine/domain/audio/audio_augmentation.py
import torch
import torchaudio
import torchaudio.transforms as T
from typing import Optional

class AudioAugmentation:
    """Data augmentation para audio vocal"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
    
    def add_gaussian_noise(
        self,
        waveform: torch.Tensor,
        noise_level: float = 0.005,
    ) -> torch.Tensor:
        """Añadir ruido gaussiano"""
        noise = torch.randn_like(waveform) * noise_level
        return waveform + noise
    
    def add_reverb(
        self,
        waveform: torch.Tensor,
        room_size: float = 0.5,
    ) -> torch.Tensor:
        """Añadir reverberación simulada"""
        # Implementación simple de reverb con convolución
        impulse = self._generate_impulse_response(room_size)
        
        # Convolución
        reverbed = torch.nn.functional.conv1d(
            waveform.unsqueeze(0),
            impulse.unsqueeze(0).unsqueeze(0),
            padding=impulse.shape[0] - 1,
        )
        
        return reverbed.squeeze(0)
    
    def _generate_impulse_response(
        self,
        room_size: float,
        length: int = 48000,
    ) -> torch.Tensor:
        """Generar impulse response para reverb"""
        # Decaimiento exponencial
        t = torch.linspace(0, 1, length)
        decay = torch.exp(-t * (1 - room_size) * 10)
        
        # Ruido inicial
        impulse = torch.zeros(length)
        impulse[0] = 1.0
        
        return impulse * decay
    
    def random_pitch_shift(
        self,
        waveform: torch.Tensor,
        semitones_range: tuple = (-2, 2),
    ) -> torch.Tensor:
        """Pitch shift aleatorio"""
        import random
        semitones = random.uniform(*semitones_range)
        
        return torchaudio.functional.pitch_shift(
            waveform,
            sample_rate=self.sample_rate,
            n_steps=semitones,
        )
    
    def random_time_stretch(
        self,
        waveform: torch.Tensor,
        rate_range: tuple = (0.9, 1.1),
    ) -> torch.Tensor:
        """Time stretch aleatorio"""
        import random
        rate = random.uniform(*rate_range)
        
        return torchaudio.functional.time_stretch(
            waveform,
            sample_rate=self.sample_rate,
            fixed_rate=rate,
        )
    
    def apply_augmentation_chain(
        self,
        waveform: torch.Tensor,
        augmentations: list,
    ) -> torch.Tensor:
        """Aplicar cadena de augmentaciones"""
        result = waveform
        
        for aug in augmentations:
            if aug == 'noise':
                result = self.add_gaussian_noise(result)
            elif aug == 'pitch':
                result = self.random_pitch_shift(result)
            elif aug == 'time':
                result = self.random_time_stretch(result)
        
        return result
```

## Restricciones

- NO cargar audio sin verificar que existe el archivo
- NO olvidar convertir a mono para análisis vocal
- NO usar sample rates inconsistentes (siempre 16kHz para voz)
- NO bloquear el event loop con carga de audio
- Siempre normalizar audio antes de procesamiento
- Siempre manejar archivos corruptos o vacíos
- Siempre verificar forma de tensor (channels, time)

## Ejemplos

### Bueno: Pipeline Completo de Análisis
```python
# apps/audio-engine/pipelines/voice_analysis.py
class VoiceAnalysisPipeline:
    """Pipeline completo de análisis de voz"""
    
    def __init__(self):
        self.preprocessor = AudioPreprocessingPipeline(
            target_sample_rate=16000,
            target_duration=10.0,
            normalize=True,
            trim_silence=True,
        )
        self.feature_extractor = TorchAudioFeatureExtractor()
    
    async def analyze(self, file_path: str) -> dict:
        """Analizar archivo de voz"""
        # 1. Preprocesar
        waveform = self.preprocessor.process(file_path)
        
        # 2. Extraer features
        features = self.feature_extractor.extract_all_features(waveform)
        
        # 3. Calcular métricas agregadas
        metrics = {
            'avg_spectral_centroid': features['spectral_centroid'].mean().item(),
            'avg_spectral_bandwidth': features['spectral_bandwidth'].mean().item(),
            'avg_rms_energy': features['rms'].mean().item(),
            'avg_zcr': features['zcr'].mean().item(),
            'mfcc_mean': features['mfcc'].mean(dim=-1).tolist(),
        }
        
        return {
            'waveform': waveform,
            'features': features,
            'metrics': metrics,
            'duration': waveform.shape[-1] / 16000,
        }
```
