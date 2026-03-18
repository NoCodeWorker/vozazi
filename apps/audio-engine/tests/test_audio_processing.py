"""
Audio Processing Tests for VOZAZI Audio Engine

Tests for audio ingestion, processing, and analysis pipelines.
"""

import pytest
import numpy as np
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch


class TestAudioIngestion:
    """Tests for audio ingestion service."""
    
    @pytest.mark.asyncio
    async def test_validate_audio_format(self):
        """Test audio format validation."""
        from app.services.ingestion_service import AudioIngestionService
        
        service = AudioIngestionService()
        
        # Valid formats
        assert service.validate_format('audio/wav') is True
        assert service.validate_format('audio/mp3') is True
        assert service.validate_format('audio/ogg') is True
        assert service.validate_format('audio/flac') is True
        assert service.validate_format('audio/m4a') is True
        
        # Invalid formats
        assert service.validate_format('video/mp4') is False
        assert service.validate_format('application/pdf') is False
        assert service.validate_format('text/plain') is False
    
    @pytest.mark.asyncio
    async def test_validate_file_size(self):
        """Test file size validation."""
        from app.services.ingestion_service import AudioIngestionService
        
        service = AudioIngestionService()
        
        # Valid sizes
        assert service.validate_size(1024 * 1024) is True  # 1MB
        assert service.validate_size(50 * 1024 * 1024) is True  # 50MB
        
        # Invalid sizes
        assert service.validate_size(600 * 1024 * 1024) is False  # 600MB
    
    @pytest.mark.asyncio
    async def test_normalize_audio(self, sample_audio_file):
        """Test audio normalization."""
        from app.services.ingestion_service import AudioIngestionService
        
        service = AudioIngestionService()
        
        normalized = await service.normalize_audio(sample_audio_file)
        
        assert normalized is not None
        assert len(normalized) > 0
    
    @pytest.mark.asyncio
    async def test_resample_audio(self, sample_audio_file):
        """Test audio resampling."""
        from app.services.ingestion_service import AudioIngestionService
        
        service = AudioIngestionService()
        target_sample_rate = 16000
        
        resampled = await service.resample_audio(
            sample_audio_file,
            target_sample_rate
        )
        
        assert resampled is not None


class TestPitchTracking:
    """Tests for pitch tracking algorithms."""
    
    @pytest.mark.asyncio
    async def test_torchcrepe_pitch_detection(self, sample_audio_bytes):
        """Test pitch detection with torchcrepe."""
        from app.domain.audio.pitch import detect_pitch_torchcrepe
        
        pitch_data = await detect_pitch_torchcrepe(sample_audio_bytes)
        
        assert pitch_data is not None
        assert 'f0' in pitch_data  # Fundamental frequency
        assert 'confidence' in pitch_data
    
    @pytest.mark.asyncio
    async def test_pitch_accuracy_calculation(self):
        """Test pitch accuracy calculation."""
        from app.domain.metrics.pitch import calculate_pitch_accuracy
        
        # Perfect pitch
        accuracy = calculate_pitch_accuracy(
            detected_freqs=[440.0, 440.0, 440.0],
            target_freq=440.0
        )
        assert accuracy > 0.95
        
        # Off pitch
        accuracy = calculate_pitch_accuracy(
            detected_freqs=[460.0, 465.0, 455.0],
            target_freq=440.0
        )
        assert accuracy < 0.8
    
    @pytest.mark.asyncio
    async def test_pitch_stability_calculation(self):
        """Test pitch stability calculation."""
        from app.domain.metrics.pitch import calculate_pitch_stability
        
        # Stable pitch
        stability = calculate_pitch_stability([440.0, 440.1, 439.9, 440.0])
        assert stability > 0.9
        
        # Unstable pitch
        stability = calculate_pitch_stability([440.0, 460.0, 420.0, 480.0])
        assert stability < 0.5
    
    @pytest.mark.asyncio
    async def test_cents_deviation(self):
        """Test cents deviation calculation."""
        from app.domain.metrics.pitch import calculate_cents_deviation
        
        # Perfect pitch = 0 cents
        cents = calculate_cents_deviation(440.0, 440.0)
        assert abs(cents) < 1
        
        # Sharp = positive cents
        cents = calculate_cents_deviation(445.0, 440.0)
        assert cents > 0
        
        # Flat = negative cents
        cents = calculate_cents_deviation(435.0, 440.0)
        assert cents < 0


class TestVAD:
    """Tests for Voice Activity Detection."""
    
    @pytest.mark.asyncio
    async def test_silero_vad(self, sample_audio_bytes):
        """Test Silero VAD."""
        from app.domain.audio.vad import detect_voice_activity
        
        vad_result = await detect_voice_activity(sample_audio_bytes)
        
        assert vad_result is not None
        assert 'voice_segments' in vad_result
        assert 'speech_probability' in vad_result
    
    @pytest.mark.asyncio
    async def test_voice_segment_detection(self):
        """Test voice segment detection."""
        from app.domain.audio.vad import detect_voice_segments
        
        # Create audio with silent and voice parts
        audio = np.zeros(44100)  # 1 second silence
        audio[22050:] = np.sin(2 * np.pi * 440 * np.linspace(0, 0.5, 22050))  # 0.5s tone
        
        segments = detect_voice_segments(audio, sample_rate=44100)
        
        assert len(segments) > 0
    
    @pytest.mark.asyncio
    async def test_speech_duration_calculation(self):
        """Test speech duration calculation."""
        from app.domain.audio.vad import calculate_speech_duration
        
        segments = [(0.5, 1.5), (2.0, 3.0)]  # Two 1-second segments
        duration = calculate_speech_duration(segments)
        
        assert duration == 2.0


class TestAudioFeatures:
    """Tests for audio feature extraction."""
    
    @pytest.mark.asyncio
    async def test_mfcc_extraction(self, sample_audio_bytes):
        """Test MFCC feature extraction."""
        from app.domain.audio.features import extract_mfcc
        
        mfccs = await extract_mfcc(sample_audio_bytes)
        
        assert mfccs is not None
        assert len(mfccs.shape) == 2  # (n_frames, n_coefficients)
    
    @pytest.mark.asyncio
    async def test_spectral_centroid(self, sample_audio_bytes):
        """Test spectral centroid calculation."""
        from app.domain.audio.features import calculate_spectral_centroid
        
        centroid = await calculate_spectral_centroid(sample_audio_bytes)
        
        assert centroid is not None
        assert centroid > 0
    
    @pytest.mark.asyncio
    async def test_zero_crossing_rate(self, sample_audio_bytes):
        """Test zero crossing rate calculation."""
        from app.domain.audio.features import calculate_zcr
        
        zcr = await calculate_zcr(sample_audio_bytes)
        
        assert zcr is not None
        assert 0 <= zcr <= 1
    
    @pytest.mark.asyncio
    async def test_rms_energy(self, sample_audio_bytes):
        """Test RMS energy calculation."""
        from app.domain.audio.features import calculate_rms
        
        rms = await calculate_rms(sample_audio_bytes)
        
        assert rms is not None
        assert rms >= 0


class TestNoiseReduction:
    """Tests for noise reduction."""
    
    @pytest.mark.asyncio
    async def test_rnnoise_reduction(self, noisy_audio_bytes):
        """Test RNNoise noise reduction."""
        from app.domain.audio.denoise import reduce_noise_rnnoise
        
        cleaned = await reduce_noise_rnnoise(noisy_audio_bytes)
        
        assert cleaned is not None
        assert len(cleaned) > 0
    
    @pytest.mark.asyncio
    async def test_noise_estimate(self, sample_audio_bytes):
        """Test noise estimation."""
        from app.domain.audio.denoise import estimate_noise
        
        noise_profile = await estimate_noise(sample_audio_bytes)
        
        assert noise_profile is not None


class TestScoring:
    """Tests for evaluation scoring."""
    
    @pytest.mark.asyncio
    async def test_overall_score_calculation(self):
        """Test overall score calculation."""
        from app.domain.scoring.evaluation import calculate_overall_score
        
        metrics = {
            'pitch_accuracy': 0.85,
            'pitch_stability': 0.78,
            'breath_support': 0.72,
            'onset_control': 0.80,
            'consistency': 0.75
        }
        
        score = calculate_overall_score(metrics)
        
        assert score is not None
        assert 0 <= score <= 100
        
        # Weighted average should be around 78
        assert 70 <= score <= 85
    
    @pytest.mark.asyncio
    async def test_weakness_detection(self):
        """Test weakness detection."""
        from app.domain.scoring.evaluation import detect_dominant_weakness
        
        metrics = {
            'pitch_accuracy': 0.90,
            'pitch_stability': 0.85,
            'breath_support': 0.50,  # Weakest
            'onset_control': 0.80,
            'consistency': 0.75
        }
        
        weakness = detect_dominant_weakness(metrics)
        
        assert weakness == 'breath_support'
    
    @pytest.mark.asyncio
    async def test_exercise_scoring(self):
        """Test exercise-specific scoring."""
        from app.domain.scoring.evaluation import score_exercise
        
        result = await score_exercise(
            exercise_type='sustain_note',
            metrics={'pitch_accuracy': 0.85, 'stability': 0.78},
            target_note='A4'
        )
        
        assert result is not None
        assert 'score' in result
        assert 'feedback' in result


class TestAudioClassification:
    """Tests for audio classification."""
    
    @pytest.mark.asyncio
    async def test_vowel_classification(self, sample_audio_bytes):
        """Test vowel classification."""
        from app.domain.audio.classifiers import classify_vowel
        
        vowel = await classify_vowel(sample_audio_bytes)
        
        assert vowel is not None
        assert vowel in ['a', 'e', 'i', 'o', 'u', 'unknown']
    
    @pytest.mark.asyncio
    async def test_register_detection(self, sample_audio_bytes):
        """Test vocal register detection."""
        from app.domain.audio.classifiers import detect_register
        
        register = await detect_register(sample_audio_bytes)
        
        assert register is not None
        assert register in ['chest', 'head', 'mixed', 'falsetto', 'unknown']
    
    @pytest.mark.asyncio
    async def test_fatigue_detection(self):
        """Test vocal fatigue detection."""
        from app.domain.audio.classifiers import detect_fatigue
        
        # Simulate fatigated voice metrics
        metrics = {
            'jitter': 0.02,  # High
            'shimmer': 0.03,  # High
            'harmonics_to_noise': 15  # Low
        }
        
        fatigue = detect_fatigue(metrics)
        
        assert fatigue is not None
        assert 'fatigue_level' in fatigue


class TestAudioSegmentation:
    """Tests for audio segmentation."""
    
    @pytest.mark.asyncio
    async def test_segment_by_silence(self, sample_audio_bytes):
        """Test segmentation by silence detection."""
        from app.domain.audio.segmentation import segment_by_silence
        
        segments = await segment_by_silence(sample_audio_bytes)
        
        assert segments is not None
        assert isinstance(segments, list)
    
    @pytest.mark.asyncio
    async def test_extract_onset(self, sample_audio_bytes):
        """Test onset extraction."""
        from app.domain.audio.segmentation import extract_onset
        
        onset = await extract_onset(sample_audio_bytes)
        
        assert onset is not None
        assert 'time' in onset
        assert 'amplitude' in onset


class TestIntegration:
    """Integration tests for audio processing pipeline."""
    
    @pytest.mark.asyncio
    async def test_full_analysis_pipeline(self, sample_audio_file):
        """Test complete analysis pipeline."""
        from app.pipelines.deep import DeepAnalysisPipeline
        
        pipeline = DeepAnalysisPipeline()
        results = await pipeline.analyze(sample_audio_file)
        
        assert results is not None
        assert 'pitch' in results
        assert 'features' in results
        assert 'vad' in results
        assert 'score' in results
    
    @pytest.mark.asyncio
    async def test_realtime_pipeline(self, sample_audio_bytes):
        """Test real-time analysis pipeline."""
        from app.pipelines.realtime import RealtimePipeline
        
        pipeline = RealtimePipeline()
        results = await pipeline.process_chunk(sample_audio_bytes)
        
        assert results is not None
        assert 'pitch' in results
        assert 'latency' in results
        
        # Real-time should be fast
        assert results['latency'] < 0.1  # Under 100ms
    
    @pytest.mark.asyncio
    async def test_batch_processing(self, multiple_audio_files):
        """Test batch processing."""
        from app.services.analysis_service import AnalysisService
        
        service = AnalysisService()
        results = await service.process_batch(multiple_audio_files)
        
        assert len(results) == len(multiple_audio_files)
        assert all(r is not None for r in results)
