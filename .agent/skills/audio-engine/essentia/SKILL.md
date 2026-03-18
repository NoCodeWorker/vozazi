---
name: essentia
description: Essentia para análisis de características musicales y descriptores de audio en VOZAZI. Use cuando implemente análisis de timbre, ritmo, o características musicales avanzadas.
---

# Essentia Audio Analysis Skill

Esta skill proporciona experiencia en Essentia para extracción de descriptores de audio avanzados y análisis musical en VOZAZI.

## Objetivo

Implementar análisis de audio de alto nivel usando Essentia para extraer descriptores musicales, características de timbre, y métricas avanzadas para evaluación vocal.

## Instrucciones

### 1. Configuración e Instalación

```bash
# requirements.txt
essentia-tensorflow>=2.1b6
numpy>=1.24.0
```

```python
# apps/audio-engine/domain/audio/essentia_wrapper.py
import essentia
import essentia.standard as es
import essentia.tensorflow as etf
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

@dataclass
class EssentiaFeatures:
    """Features extraídas con Essentia"""
    # Timbre
    mfcc: List[float]
    spectral_contrast: List[float]
    spectral_centroid: float
    spectral_spread: float
    spectral_rolloff: float
    
    # Ritmo
    bpm: float
    bpm_confidence: float
    beat_positions: List[float]
    
    # Tonalidad
    key: str
    key_confidence: float
    scale: str
    
    # Loudness
    loudness: float
    dynamic_complexity: float
    
    # Calidad
    inharmonicity: float
    dissonance: float

class EssentiaFeatureExtractor:
    """Extractor de features con Essentia"""
    
    def __init__(self, sample_rate: int = 44100):
        self.sample_rate = sample_rate
        self._init_algorithms()
    
    def _init_algorithms(self):
        """Inicializar algoritmos de Essentia"""
        # MFCC
        self.mfcc_algo = es.MFCC(
            sampleRate=self.sample_rate,
            numberCoefficients=13,
        )
        
        # Spectral Contrast
        self.spectral_contrast_algo = es.SpectralContrast(
            sampleRate=self.sample_rate,
        )
        
        # Spectral Centroid
        self.spectral_centroid_algo = es.SpectralCentroid(
            sampleRate=self.sample_rate,
        )
        
        # Key Detection
        self.key_algo = es.KeyExtractor()
        
        # Rhythm Extractor
        self.rhythm_algo = es.RhythmExtractor2013(
            method="multifeature",
        )
        
        # Loudness
        self.loudness_algo = es.Loudness(
            sampleRate=self.sample_rate,
        )
        
        # Inharmonicity
        self.inharmonicity_algo = es.Inharmonicity(
            sampleRate=self.sample_rate,
        )
    
    def extract_all_features(
        self,
        audio: es.Pool,
    ) -> EssentiaFeatures:
        """
        Extraer todas las características
        
        Args:
            audio: Pool de Essentia con audio cargado
            
        Returns:
            EssentiaFeatures con todas las características
        """
        # MFCC
        mfcc = self.mfcc_algo(audio)[0].tolist()
        
        # Spectral Contrast
        spectral_contrast = self.spectral_contrast_algo(audio)[0].tolist()
        
        # Spectral Centroid
        spectral_centroid = self.spectral_centroid_algo(audio)[0]
        
        # Spectral Spread
        spectral_spread = es.SpectralSpread()(audio)[0]
        
        # Spectral Rolloff
        spectral_rolloff = es.SpectralRollOff()(audio)[0]
        
        # Key
        key_result = self.key_algo(audio)
        key = key_result[0]
        key_confidence = key_result[1]
        scale = key_result[2]
        
        # Rhythm
        bpm, bpm_confidence, beats = self.rhythm_algo(audio)[:3]
        
        # Loudness
        loudness = self.loudness_algo(audio)[0]
        
        # Dynamic Complexity
        dynamic_complexity = es.DynamicComplexity()(audio)[0]
        
        # Inharmonicity
        inharmonicity = self.inharmonicity_algo(audio)[0]
        
        # Dissonance
        dissonance = es.Dissonance()(audio)[0]
        
        return EssentiaFeatures(
            mfcc=mfcc,
            spectral_contrast=spectral_contrast,
            spectral_centroid=spectral_centroid,
            spectral_spread=spectral_spread,
            spectral_rolloff=spectral_rolloff,
            bpm=bpm,
            bpm_confidence=bpm_confidence,
            beat_positions=beats.tolist() if hasattr(beats, 'tolist') else beats,
            key=key,
            key_confidence=key_confidence,
            scale=scale,
            loudness=loudness,
            dynamic_complexity=dynamic_complexity,
            inharmonicity=inharmonicity,
            dissonance=dissonance,
        )
    
    def extract_from_file(
        self,
        file_path: str,
    ) -> EssentiaFeatures:
        """Extraer features directamente desde archivo"""
        # Cargar audio
        loader = es.MonoLoader(filename=file_path)
        audio = loader()
        
        # Crear pool
        pool = essentia.Pool()
        pool['audio'] = audio
        
        return self.extract_all_features(pool)
```

### 2. Análisis de Timbre Vocal

```python
# apps/audio-engine/domain/audio/timbre_analysis.py
import essentia.standard as es
from typing import Dict, Any, List

class TimbreAnalyzer:
    """Análisis de timbre vocal con Essentia"""
    
    def __init__(self, sample_rate: int = 44100):
        self.sample_rate = sample_rate
    
    def analyze_timbre(
        self,
        audio: List[float],
    ) -> Dict[str, float]:
        """
        Analizar características de timbre
        
        Returns:
            Diccionario con métricas de timbre
        """
        pool = essentia.Pool()
        pool['audio'] = audio
        
        # MFCC (13 coeficientes)
        mfcc = es.MFCC(sampleRate=self.sample_rate)(audio)[0].tolist()
        
        # Spectral Shape
        centroid = es.SpectralCentroid(sampleRate=self.sample_rate)(audio)[0]
        spread = es.SpectralSpread(sampleRate=self.sample_rate)(audio)[0]
        skewness = es.SpectralSkewness(sampleRate=self.sample_rate)(audio)[0]
        kurtosis = es.SpectralKurtosis(sampleRate=self.sample_rate)(audio)[0]
        
        # Spectral Contrast (6 bandas)
        contrast = es.SpectralContrast(sampleRate=self.sample_rate)(audio)[0].tolist()
        
        # Spectral Flatness
        flatness = es.SpectralFlatness(sampleRate=self.sample_rate)(audio)[0]
        
        # Zero Crossing Rate
        zcr = es.ZeroCrossingRate()(audio)[0]
        
        return {
            'mfcc_1': mfcc[0],
            'mfcc_2': mfcc[1],
            'mfcc_3': mfcc[2],
            'mfcc_4': mfcc[3],
            'mfcc_5': mfcc[4],
            'spectral_centroid': centroid,
            'spectral_spread': spread,
            'spectral_skewness': skewness,
            'spectral_kurtosis': kurtosis,
            'spectral_flatness': flatness,
            'spectral_contrast_1': contrast[0],
            'spectral_contrast_2': contrast[1],
            'spectral_contrast_3': contrast[2],
            'zero_crossing_rate': zcr,
        }
    
    def calculate_brightness(
        self,
        audio: List[float],
    ) -> float:
        """
        Calcular brillo del timbre
        
        El brillo está relacionado con la energía en altas frecuencias
        """
        pool = essentia.Pool()
        pool['audio'] = audio
        
        # Spectral Centroid como proxy de brillo
        centroid = es.SpectralCentroid(sampleRate=self.sample_rate)(audio)[0]
        
        # Normalizar a 0-1 (asumiendo centroid máximo ~5000 Hz para voz)
        brightness = min(1.0, centroid / 5000)
        
        return brightness
    
    def calculate_warmth(
        self,
        audio: List[float],
    ) -> float:
        """
        Calcular calidez del timbre
        
        La calidez está relacionada con energía en bajas frecuencias
        """
        # Calcular energía en banda baja (0-500 Hz)
        spectrum = es.Spectrum()(audio)[0]
        freqs = es.Spectrum()(audio)[1]
        
        low_mask = freqs < 500
        high_mask = freqs >= 500
        
        low_energy = spectrum[low_mask].sum()
        high_energy = spectrum[high_mask].sum()
        
        total_energy = low_energy + high_energy
        
        if total_energy < 1e-10:
            return 0.5
        
        # Más energía baja = más calidez
        warmth = low_energy / total_energy
        
        return float(warmth)
    
    def calculate_richness(
        self,
        audio: List[float],
    ) -> float:
        """
        Calcular riqueza espectral
        
        Relacionado con la complejidad del espectro
        """
        # Spectral Complexity
        complexity = es.SpectralComplexity()(audio)[0]
        
        # Normalizar (típicamente 1-10)
        richness = min(1.0, (complexity - 1) / 9)
        
        return richness
```

### 3. Detección de Tonalidad y Escala

```python
# apps/audio-engine/domain/audio/key_detection.py
import essentia.standard as es
from typing import Dict, Any, Tuple

class KeyDetector:
    """Detección de tonalidad y escala"""
    
    # Mapeo de notación
    KEY_MAP = {
        'C': 'C', 'C#': 'C#', 'Db': 'C#',
        'D': 'D', 'D#': 'D#', 'Eb': 'D#',
        'E': 'E', 'F': 'F', 'F#': 'F#',
        'Gb': 'F#', 'G': 'G', 'G#': 'G#',
        'Ab': 'G#', 'A': 'A', 'A#': 'A#',
        'Bb': 'A#', 'B': 'B',
    }
    
    def __init__(self):
        self.key_extractor = es.KeyExtractor()
    
    def detect_key(
        self,
        audio: list,
    ) -> Dict[str, Any]:
        """
        Detectar tonalidad y escala
        
        Returns:
            Diccionario con key, scale, confidence
        """
        key, confidence, scale = self.key_extractor(audio)
        
        return {
            'key': self.KEY_MAP.get(key, key),
            'key_normalized': key,
            'scale': scale,  # 'major' o 'minor'
            'confidence': float(confidence),
            'key_scale': f"{key} {scale}",
        }
    
    def detect_key_changes(
        self,
        audio: list,
        segment_duration: float = 5.0,
        sample_rate: int = 44100,
    ) -> list[Dict[str, Any]]:
        """
        Detectar cambios de tonalidad en el tiempo
        
        Args:
            audio: Audio completo
            segment_duration: Duración de segmento en segundos
            
        Returns:
            Lista de detecciones por segmento
        """
        segment_samples = int(segment_duration * sample_rate)
        detections = []
        
        for i in range(0, len(audio), segment_samples):
            segment = audio[i:i + segment_samples]
            
            if len(segment) < sample_rate:  # Muy corto
                continue
            
            try:
                key_data = self.detect_key(segment)
                key_data['segment_start'] = i / sample_rate
                key_data['segment_end'] = (i + len(segment)) / sample_rate
                detections.append(key_data)
            except:
                continue
        
        # Detectar cambios
        changes = []
        for i in range(1, len(detections)):
            prev_key = detections[i-1]['key_normalized']
            curr_key = detections[i]['key_normalized']
            
            if prev_key != curr_key:
                changes.append({
                    'time': detections[i]['segment_start'],
                    'from_key': prev_key,
                    'to_key': curr_key,
                })
        
        return {
            'segments': detections,
            'key_changes': changes,
            'primary_key': self._find_primary_key(detections),
        }
    
    def _find_primary_key(
        self,
        detections: list,
    ) -> str:
        """Encontrar tonalidad predominante"""
        if not detections:
            return 'unknown'
        
        keys = [d['key_normalized'] for d in detections]
        return max(set(keys), key=keys.count)
```

### 4. Análisis de Ritmo y Tempo

```python
# apps/audio-engine/domain/audio/rhythm_analysis.py
import essentia.standard as es
from typing import Dict, Any, List

class RhythmAnalyzer:
    """Análisis de ritmo y tempo"""
    
    def __init__(self, sample_rate: int = 44100):
        self.sample_rate = sample_rate
        self.rhythm_extractor = es.RhythmExtractor2013(method="multifeature")
        self.beat_tracker = es.BeatTrackerMultiFeature()
    
    def analyze_rhythm(
        self,
        audio: list,
    ) -> Dict[str, Any]:
        """
        Analizar características rítmicas
        
        Returns:
            BPM, confidence, beat positions
        """
        bpm, bpm_confidence, beats, _, _ = self.rhythm_extractor(audio)
        
        return {
            'bpm': float(bpm),
            'bpm_confidence': float(bpm_confidence),
            'beat_count': len(beats),
            'beat_positions': beats.tolist() if hasattr(beats, 'tolist') else beats,
            'avg_beat_interval': self._calculate_avg_interval(beats),
        }
    
    def detect_beats(
        self,
        audio: list,
    ) -> List[float]:
        """Detectar posiciones de beats"""
        beats, _, _ = self.beat_tracker(audio)
        return beats.tolist()
    
    def calculate_rhythm_consistency(
        self,
        audio: list,
    ) -> float:
        """
        Calcular consistencia rítmica
        
        Mide qué tan regular es el ritmo detectado
        """
        bpm, confidence, beats, _, _ = self.rhythm_extractor(audio)
        
        if len(beats) < 2:
            return 0.0
        
        # Calcular intervalos entre beats
        intervals = [beats[i+1] - beats[i] for i in range(len(beats)-1)]
        
        # Calcular varianza
        avg_interval = sum(intervals) / len(intervals)
        variance = sum((i - avg_interval) ** 2 for i in intervals) / len(intervals)
        
        # Convertir a score 0-1 (menor varianza = más consistente)
        # Varianza típica: 0-0.1 para ritmo muy consistente
        consistency = max(0.0, 1.0 - (variance * 10))
        
        return float(consistency)
    
    def _calculate_avg_interval(self, beats: list) -> float:
        """Calcular intervalo promedio entre beats"""
        if len(beats) < 2:
            return 0.0
        
        intervals = [beats[i+1] - beats[i] for i in range(len(beats)-1)]
        return sum(intervals) / len(intervals)
```

### 5. Servicio Completo de Análisis

```python
# apps/audio-engine/services/essentia_analysis_service.py
from typing import Dict, Any, Optional
import essentia.standard as es
from ..domain.audio.essentia_wrapper import EssentiaFeatureExtractor, EssentiaFeatures
from ..domain.audio.timbre_analysis import TimbreAnalyzer
from ..domain.audio.key_detection import KeyDetector
from ..domain.audio.rhythm_analysis import RhythmAnalyzer

class EssentiaAnalysisService:
    """Servicio completo de análisis con Essentia"""
    
    def __init__(self, sample_rate: int = 44100):
        self.sample_rate = sample_rate
        self.feature_extractor = EssentiaFeatureExtractor(sample_rate)
        self.timbre_analyzer = TimbreAnalyzer(sample_rate)
        self.key_detector = KeyDetector()
        self.rhythm_analyzer = RhythmAnalyzer(sample_rate)
    
    def analyze_voice(
        self,
        audio_file: str,
    ) -> Dict[str, Any]:
        """
        Análisis completo de voz con Essentia
        
        Returns:
            Diccionario con todas las características
        """
        # Cargar audio
        loader = es.MonoLoader(filename=audio_file)
        audio = loader()
        audio_list = audio.tolist()
        
        # 1. Features generales
        features = self.feature_extractor.extract_from_file(audio_file)
        
        # 2. Análisis de timbre
        timbre = self.timbre_analyzer.analyze_timbre(audio_list)
        timbre['brightness'] = self.timbre_analyzer.calculate_brightness(audio_list)
        timbre['warmth'] = self.timbre_analyzer.calculate_warmth(audio_list)
        timbre['richness'] = self.timbre_analyzer.calculate_richness(audio_list)
        
        # 3. Tonalidad
        key = self.key_detector.detect_key(audio_list)
        
        # 4. Ritmo
        rhythm = self.rhythm_analyzer.analyze_rhythm(audio_list)
        rhythm['consistency'] = self.rhythm_analyzer.calculate_rhythm_consistency(audio_list)
        
        # 5. Features derivados para VOZAZI
        vocal_metrics = self._calculate_vocal_metrics(features, timbre)
        
        return {
            'essentia_features': {
                'mfcc': features.mfcc,
                'spectral_contrast': features.spectral_contrast,
                'spectral_centroid': features.spectral_centroid,
                'bpm': features.bpm,
                'loudness': features.loudness,
                'inharmonicity': features.inharmonicity,
            },
            'timbre': timbre,
            'key': key,
            'rhythm': rhythm,
            'vocal_metrics': vocal_metrics,
            'duration': len(audio) / self.sample_rate,
        }
    
    def _calculate_vocal_metrics(
        self,
        features: EssentiaFeatures,
        timbre: Dict[str, float],
    ) -> Dict[str, float]:
        """Calcular métricas vocales específicas para VOZAZI"""
        
        # Resonancia estimada desde spectral centroid
        resonance = min(1.0, features.spectral_centroid / 3000)
        
        # Calidad tonal desde inharmonicity (menor = mejor)
        tonal_quality = max(0.0, 1.0 - features.inharmonicity)
        
        # Control de dinámica desde dynamic complexity
        dynamic_control = min(1.0, features.dynamic_complexity / 10)
        
        # Riqueza armónica desde spectral contrast
        harmonic_richness = sum(features.spectral_contrast[:3]) / 3
        
        return {
            'resonance_estimate': resonance,
            'tonal_quality': tonal_quality,
            'dynamic_control': dynamic_control,
            'harmonic_richness': harmonic_richness,
            'brightness': timbre.get('brightness', 0.5),
            'warmth': timbre.get('warmth', 0.5),
        }
```

## Restricciones

- NO usar Essentia sin verificar que el audio está cargado correctamente
- NO olvidar que Essentia espera audio como lista de floats, no numpy array
- NO mezclar sample rates diferentes (Essentia usa 44100 por defecto)
- NO bloquear event loop con análisis pesado
- Siempre manejar errores de análisis gracefully
- Siempre verificar que el audio tiene duración suficiente
- Siempre convertir tipos apropiadamente (tensorflow ↔ standard)

## Ejemplos

### Bueno: Pipeline Combinado Essentia + librosa
```python
# apps/audio-engine/pipelines/full_music_analysis.py
class FullMusicAnalysisPipeline:
    """Pipeline combinando Essentia y librosa"""
    
    def __init__(self):
        self.essentia_service = EssentiaAnalysisService()
        self.librosa_extractor = LibrosaFeatureExtractor()
    
    async def analyze(self, audio_file: str) -> dict:
        """Análisis completo combinando ambas librerías"""
        
        # Análisis en paralelo
        essentia_result = await asyncio.get_event_loop().run_in_executor(
            None,
            self.essentia_service.analyze_voice,
            audio_file,
        )
        
        librosa_result = await asyncio.get_event_loop().run_in_executor(
            None,
            self.librosa_extractor.extract_all_features,
            audio_file,
        )
        
        # Combinar resultados
        return {
            'essentia': essentia_result,
            'librosa': librosa_result,
            'combined_metrics': self._combine_metrics(essentia_result, librosa_result),
        }
    
    def _combine_metrics(self, essentia: dict, librosa: dict) -> dict:
        """Combinar métricas de ambas fuentes"""
        return {
            'spectral_centroid_avg': (
                essentia['essentia_features']['spectral_centroid'] +
                librosa['avg_spectral_centroid']
            ) / 2,
            'brightness_score': essentia['timbre']['brightness'],
            'tonal_quality': essentia['vocal_metrics']['tonal_quality'],
            'rhythm_consistency': essentia['rhythm']['consistency'],
        }
```
