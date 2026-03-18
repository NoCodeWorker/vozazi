"""
Test Fixtures for VOZAZI Audio Engine

Provides common fixtures, factories, and mock data for testing.
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timedelta
import factory
from faker import Faker

fake = Faker()

# ============================================================================
# Event Loop Fixture
# ============================================================================

@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for each test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ============================================================================
# Database Fixtures
# ============================================================================

@pytest.fixture
async def db_session():
    """Create a test database session."""
    from app.mcp.database import db_mcp
    
    await db_mcp.connect()
    session = await db_mcp.get_session().__aenter__()
    
    try:
        yield session
    finally:
        await session.close()
        await db_mcp.disconnect()


@pytest.fixture
async def db_connection():
    """Create a test database connection."""
    from app.mcp.database import db_mcp
    
    await db_mcp.connect()
    
    try:
        async with db_mcp.get_connection() as conn:
            yield conn
    finally:
        await db_mcp.disconnect()


# ============================================================================
# Redis Fixtures
# ============================================================================

@pytest.fixture
async def redis_client():
    """Create a test Redis client."""
    from app.mcp.redis_client import redis_mcp
    
    await redis_mcp.connect()
    
    try:
        yield redis_mcp.client
    finally:
        # Clear all keys in test namespace
        await redis_mcp.delete_pattern("test:*")
        await redis_mcp.disconnect()


# ============================================================================
# Storage Fixtures
# ============================================================================

@pytest.fixture
def r2_storage():
    """Create a mock R2 storage client."""
    from app.mcp.storage import r2_storage_mcp
    
    # Mock the storage methods
    with patch.object(r2_storage_mcp, 'upload_file', new_callable=AsyncMock) as mock_upload:
        with patch.object(r2_storage_mcp, 'download_file', new_callable=AsyncMock) as mock_download:
            with patch.object(r2_storage_mcp, 'delete_file', new_callable=AsyncMock) as mock_delete:
                with patch.object(r2_storage_mcp, 'generate_presigned_url', new_callable=AsyncMock) as mock_presigned:
                    
                    mock_upload.return_value = {
                        "success": True,
                        "file_key": "test/audio.wav",
                        "etag": "test-etag",
                        "url": "https://test.r2.cloudflarestorage.com/audio.wav"
                    }
                    
                    mock_download.return_value = b"fake audio data"
                    
                    mock_delete.return_value = True
                    
                    mock_presigned.return_value = "https://test.presigned.url/upload"
                    
                    yield r2_storage_mcp


# ============================================================================
# LLM Client Fixtures
# ============================================================================

@pytest.fixture
def openai_client():
    """Create a mock OpenAI client."""
    from app.mcp.openai_client import openai_mcp
    
    with patch.object(openai_mcp, 'transcribe_audio', new_callable=AsyncMock) as mock_transcribe:
        with patch.object(openai_mcp, 'analyze_text', new_callable=AsyncMock) as mock_analyze:
            with patch.object(openai_mcp, 'generate_embeddings', new_callable=AsyncMock) as mock_embeddings:
                
                mock_transcribe.return_value = {
                    "text": "This is a test transcription.",
                    "language": "es",
                    "duration": 120.5
                }
                
                mock_analyze.return_value = "Test analysis result"
                
                mock_embeddings.return_value = [0.1] * 1536
                
                yield openai_mcp


@pytest.fixture
def anthropic_client():
    """Create a mock Anthropic client."""
    from app.mcp.anthropic_client import anthropic_mcp
    
    with patch.object(anthropic_mcp, 'analyze_text', new_callable=AsyncMock) as mock_analyze:
        with patch.object(anthropic_mcp, 'analyze_transcript', new_callable=AsyncMock) as mock_transcript:
            
            mock_analyze.return_value = "Test sentiment analysis from Claude"
            
            mock_transcript.return_value = {
                "summary": "Test summary",
                "keywords": "test, audio, analysis",
                "sentiment": "positive"
            }
            
            yield anthropic_mcp


# ============================================================================
# Test Data Factories
# ============================================================================

class AudioFileFactory(factory.Factory):
    """Factory for creating test audio file data."""
    
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: fake.uuid4())
    user_id = factory.LazyFunction(lambda: fake.uuid4())
    filename = factory.LazyFunction(lambda: f"{fake.slug()}.wav")
    original_name = factory.LazyFunction(lambda: fake.file_name(category="audio"))
    mime_type = factory.LazyFunction(lambda: fake.mime_type(type="audio"))
    size = factory.LazyFunction(lambda: fake.random_int(min=10000, max=10000000))
    duration = factory.LazyFunction(lambda: fake.random_int(min=10, max=3600))
    status = factory.LazyFunction(lambda: fake.random_element(["pending", "processing", "completed", "failed"]))
    storage_key = factory.LazyFunction(lambda: f"audio/{fake.uuid4()}.wav")
    public_url = factory.LazyFunction(lambda: f"https://cdn.example.com/audio/{fake.uuid4()}.wav")
    transcript = factory.LazyFunction(lambda: fake.text(max_nb_chars=500))
    analysis = factory.LazyFunction(lambda: {
        "sentiment": fake.random_element(["positive", "negative", "neutral"]),
        "keywords": fake.words(nb=5),
        "summary": fake.text(max_nb_chars=200)
    })
    created_at = factory.LazyFunction(lambda: datetime.utcnow() - timedelta(days=fake.random_int(0, 30)))
    updated_at = factory.LazyFunction(lambda: datetime.utcnow())


class UserFactory(factory.Factory):
    """Factory for creating test user data."""
    
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: fake.uuid4())
    clerk_id = factory.LazyFunction(lambda: fake.uuid4())
    email = factory.LazyFunction(lambda: fake.email())
    name = factory.LazyFunction(lambda: fake.name())
    avatar_url = factory.LazyFunction(lambda: fake.image_url())
    role = factory.LazyFunction(lambda: fake.random_element(["admin", "user", "premium"]))
    created_at = factory.LazyFunction(lambda: datetime.utcnow() - timedelta(days=fake.random_int(0, 365)))
    updated_at = factory.LazyFunction(lambda: datetime.utcnow())


class SubscriptionFactory(factory.Factory):
    """Factory for creating test subscription data."""
    
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: fake.uuid4())
    user_id = factory.LazyFunction(lambda: fake.uuid4())
    stripe_customer_id = factory.LazyFunction(lambda: f"cus_{fake.uuid4()[:8]}")
    stripe_subscription_id = factory.LazyFunction(lambda: f"sub_{fake.uuid4()[:8]}")
    plan = factory.LazyFunction(lambda: fake.random_element(["free", "pro", "enterprise"]))
    status = factory.LazyFunction(lambda: fake.random_element(["active", "cancelled", "expired"]))
    current_period_start = factory.LazyFunction(lambda: datetime.utcnow() - timedelta(days=30))
    current_period_end = factory.LazyFunction(lambda: datetime.utcnow() + timedelta(days=30))
    cancel_at_period_end = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=10))
    created_at = factory.LazyFunction(lambda: datetime.utcnow() - timedelta(days=fake.random_int(0, 365)))
    updated_at = factory.LazyFunction(lambda: datetime.utcnow())


# ============================================================================
# File Fixtures
# ============================================================================

@pytest.fixture
def sample_audio_file(tmp_path) -> str:
    """Create a sample audio file for testing."""
    audio_path = tmp_path / "test_audio.wav"
    
    # Create a minimal WAV file header + silence
    import wave
    import struct
    
    duration = 1  # seconds
    sample_rate = 44100
    num_samples = int(duration * sample_rate)
    
    with wave.open(str(audio_path), 'w') as wav_file:
        wav_file.setnchannels(1)  # mono
        wav_file.setsampwidth(2)  # 2 bytes per sample
        wav_file.setframerate(sample_rate)
        
        # Write silence
        for _ in range(num_samples):
            wav_file.writeframes(struct.pack('<h', 0))
    
    return str(audio_path)


@pytest.fixture
def sample_audio_bytes() -> bytes:
    """Create sample audio bytes for testing."""
    import io
    import wave
    import struct
    
    buffer = io.BytesIO()
    
    duration = 1  # seconds
    sample_rate = 44100
    num_samples = int(duration * sample_rate)
    
    with wave.open(buffer, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for _ in range(num_samples):
            wav_file.writeframes(struct.pack('<h', 0))
    
    return buffer.getvalue()


# ============================================================================
# Mock Context Managers
# ============================================================================

@pytest.fixture
def mock_db_session():
    """Create a mock database session context manager."""
    mock_session = AsyncMock()
    mock_session.commit = AsyncMock()
    mock_session.rollback = AsyncMock()
    mock_session.close = AsyncMock()
    
    mock_cm = MagicMock()
    mock_cm.__aenter__ = AsyncMock(return_value=mock_session)
    mock_cm.__aexit__ = AsyncMock(return_value=None)
    
    return mock_cm


@pytest.fixture
def mock_redis():
    """Create a mock Redis client."""
    mock_client = AsyncMock()
    mock_client.get = AsyncMock(return_value=None)
    mock_client.set = AsyncMock(return_value=True)
    mock_client.delete = AsyncMock(return_value=1)
    mock_client.exists = AsyncMock(return_value=1)
    mock_client.ping = AsyncMock(return_value=True)
    mock_client.keys = AsyncMock(return_value=[])
    mock_client.ttl = AsyncMock(return_value=-1)
    
    return mock_client


# ============================================================================
# Authentication Fixtures
# ============================================================================

@pytest.fixture
def auth_headers() -> dict:
    """Create mock authentication headers."""
    return {
        "Authorization": f"Bearer test_token_{fake.uuid4()}",
        "Content-Type": "application/json"
    }


@pytest.fixture
def mock_auth_user() -> dict:
    """Create mock authenticated user data."""
    return {
        "user_id": fake.uuid4(),
        "email": fake.email(),
        "role": "user"
    }
