"""
MCP Client Tests for VOZAZI

Tests for Model Context Protocol clients and integrations.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch


class TestDatabaseMCP:
    """Tests for Database MCP client."""
    
    @pytest.mark.asyncio
    async def test_database_connection(self):
        """Test database connection."""
        from app.mcp.database import db_mcp
        
        # Mock connection
        with patch('asyncpg.create_pool') as mock_pool:
            mock_pool.return_value = AsyncMock()
            await db_mcp.connect()
            
            assert db_mcp.pool is not None
    
    @pytest.mark.asyncio
    async def test_database_health_check(self):
        """Test database health check."""
        from app.mcp.database import db_mcp
        
        with patch.object(db_mcp, 'get_connection') as mock_conn:
            mock_conn.return_value.__aenter__.return_value = AsyncMock()
            mock_conn.return_value.__aenter__.return_value.fetchval.return_value = 1
            
            result = await db_mcp.health_check()
            
            assert result['status'] == 'healthy'
            assert result['service'] == 'postgresql'
    
    @pytest.mark.asyncio
    async def test_database_query(self):
        """Test database query execution."""
        from app.mcp.database import db_mcp
        
        with patch.object(db_mcp, 'get_connection') as mock_conn:
            mock_conn.return_value.__aenter__.return_value = AsyncMock()
            mock_conn.return_value.__aenter__.return_value.fetch.return_value = [
                {'id': 1, 'name': 'test'}
            ]
            
            result = await db_mcp.execute_query('SELECT * FROM test')
            
            assert len(result) == 1
            assert result[0]['id'] == 1
    
    @pytest.mark.asyncio
    async def test_database_session(self):
        """Test database session management."""
        from app.mcp.database import db_mcp
        
        with patch.object(db_mcp, 'get_session') as mock_session:
            mock_session.return_value.__aenter__.return_value = AsyncMock()
            
            async with db_mcp.get_session() as session:
                assert session is not None


class TestRedisMCP:
    """Tests for Redis MCP client."""
    
    @pytest.mark.asyncio
    async def test_redis_connection(self):
        """Test Redis connection."""
        from app.mcp.redis_client import redis_mcp
        
        with patch('redis.asyncio.from_url') as mock_redis:
            mock_redis.return_value = AsyncMock()
            mock_redis.return_value.ping.return_value = True
            
            await redis_mcp.connect()
            
            assert redis_mcp.client is not None
    
    @pytest.mark.asyncio
    async def test_redis_health_check(self):
        """Test Redis health check."""
        from app.mcp.redis_client import redis_mcp
        
        redis_mcp.client = AsyncMock()
        redis_mcp.client.ping.return_value = True
        redis_mcp.client.info.return_value = {'redis_version': '7.0.0'}
        
        result = await redis_mcp.health_check()
        
        assert result['status'] == 'healthy'
        assert result['service'] == 'redis'
    
    @pytest.mark.asyncio
    async def test_redis_cache_operations(self):
        """Test Redis cache operations."""
        from app.mcp.redis_client import redis_mcp
        
        redis_mcp.client = AsyncMock()
        
        # Set
        await redis_mcp.set('key', 'value')
        redis_mcp.client.set.assert_called_once()
        
        # Get
        redis_mcp.client.get.return_value = '"value"'
        value = await redis_mcp.get('key')
        assert value == 'value'
        
        # Delete
        await redis_mcp.delete('key')
        redis_mcp.client.delete.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_redis_rate_limiting(self):
        """Test Redis rate limiting."""
        from app.mcp.redis_client import redis_mcp
        
        redis_mcp.client = AsyncMock()
        redis_mcp.client.get.return_value = None  # First request
        
        allowed, remaining = await redis_mcp.rate_limit('user-123', max_requests=60)
        
        assert allowed is True
        assert remaining == 59
    
    @pytest.mark.asyncio
    async def test_redis_pubsub(self):
        """Test Redis pub/sub."""
        from app.mcp.redis_client import redis_mcp
        
        redis_mcp.client = AsyncMock()
        
        await redis_mcp.publish('channel', {'message': 'test'})
        redis_mcp.client.publish.assert_called_once()


class TestR2StorageMCP:
    """Tests for R2 Storage MCP client."""
    
    @pytest.mark.asyncio
    async def test_r2_health_check(self):
        """Test R2 health check."""
        from app.mcp.storage import r2_storage_mcp
        
        with patch.object(r2_storage_mcp, '_get_session') as mock_session:
            mock_client = AsyncMock()
            mock_session.return_value.client.return_value.__aenter__.return_value = mock_client
            
            result = await r2_storage_mcp.health_check()
            
            assert result['service'] == 'r2_storage'
    
    @pytest.mark.asyncio
    async def test_r2_upload(self):
        """Test R2 file upload."""
        from app.mcp.storage import r2_storage_mcp
        
        with patch.object(r2_storage_mcp, '_get_session') as mock_session:
            mock_client = AsyncMock()
            mock_client.put_object.return_value = {'ETag': '"abc123"'}
            mock_session.return_value.client.return_value.__aenter__.return_value = mock_client
            
            result = await r2_storage_mcp.upload_file(
                'test/audio.wav',
                b'audio data',
                'audio/wav'
            )
            
            assert result['success'] is True
            assert result['etag'] == 'abc123'
    
    @pytest.mark.asyncio
    async def test_r2_download(self):
        """Test R2 file download."""
        from app.mcp.storage import r2_storage_mcp
        
        with patch.object(r2_storage_mcp, '_get_session') as mock_session:
            mock_client = AsyncMock()
            mock_client.get_object.return_value = {
                'Body': AsyncMock(read=AsyncMock(return_value=b'audio data'))
            }
            mock_session.return_value.client.return_value.__aenter__.return_value = mock_client
            
            data = await r2_storage_mcp.download_file('test/audio.wav')
            
            assert data == b'audio data'
    
    @pytest.mark.asyncio
    async def test_r2_delete(self):
        """Test R2 file delete."""
        from app.mcp.storage import r2_storage_mcp
        
        with patch.object(r2_storage_mcp, '_get_session') as mock_session:
            mock_client = AsyncMock()
            mock_client.delete_object.return_value = {}
            mock_session.return_value.client.return_value.__aenter__.return_value = mock_client
            
            result = await r2_storage_mcp.delete_file('test/audio.wav')
            
            assert result is True
    
    @pytest.mark.asyncio
    async def test_r2_presigned_url(self):
        """Test R2 presigned URL generation."""
        from app.mcp.storage import r2_storage_mcp
        
        with patch.object(r2_storage_mcp, '_get_session') as mock_session:
            mock_client = AsyncMock()
            mock_client.generate_presigned_url.return_value = 'https://presigned.url'
            mock_session.return_value.client.return_value.__aenter__.return_value = mock_client
            
            url = await r2_storage_mcp.generate_presigned_url('test/audio.wav')
            
            assert url == 'https://presigned.url'


class TestOpenAIMCP:
    """Tests for OpenAI MCP client."""
    
    @pytest.mark.asyncio
    async def test_openai_health_check(self):
        """Test OpenAI health check."""
        from app.mcp.openai_client import openai_mcp
        
        openai_mcp.client = AsyncMock()
        openai_mcp.client.models.list = AsyncMock()
        
        result = await openai_mcp.health_check()
        
        assert result['status'] == 'healthy'
        assert result['service'] == 'openai'
    
    @pytest.mark.asyncio
    async def test_openai_transcription(self):
        """Test OpenAI audio transcription."""
        from app.mcp.openai_client import openai_mcp
        
        openai_mcp.client = AsyncMock()
        openai_mcp.client.audio.transcriptions.create = AsyncMock(
            return_value=MagicMock(
                text='Test transcription',
                language='es',
                duration=120.5
            )
        )
        
        with patch('builtins.open'):
            result = await openai_mcp.transcribe_audio('test.wav')
        
        assert result is not None
        assert result['text'] == 'Test transcription'
    
    @pytest.mark.asyncio
    async def test_openai_text_analysis(self):
        """Test OpenAI text analysis."""
        from app.mcp.openai_client import openai_mcp
        
        openai_mcp.client = AsyncMock()
        openai_mcp.client.chat.completions.create = AsyncMock(
            return_value=MagicMock(
                choices=[MagicMock(message=MagicMock(content='Analysis result'))]
            )
        )
        
        result = await openai_mcp.analyze_text('Test text', 'summarize')
        
        assert result == 'Analysis result'
    
    @pytest.mark.asyncio
    async def test_openai_embeddings(self):
        """Test OpenAI embeddings generation."""
        from app.mcp.openai_client import openai_mcp
        
        openai_mcp.client = AsyncMock()
        openai_mcp.client.embeddings.create = AsyncMock(
            return_value=MagicMock(
                data=[MagicMock(embedding=[0.1] * 1536)]
            )
        )
        
        embedding = await openai_mcp.generate_embeddings('Test text')
        
        assert len(embedding) == 1536


class TestAnthropicMCP:
    """Tests for Anthropic MCP client."""
    
    @pytest.mark.asyncio
    async def test_anthropic_health_check(self):
        """Test Anthropic health check."""
        from app.mcp.anthropic_client import anthropic_mcp
        
        anthropic_mcp.client = AsyncMock()
        anthropic_mcp.client.messages.create = AsyncMock(
            return_value=MagicMock(content=[MagicMock(text='Hello')])
        )
        
        result = await anthropic_mcp.health_check()
        
        assert result['status'] == 'healthy'
        assert result['service'] == 'anthropic'
    
    @pytest.mark.asyncio
    async def test_anthropic_text_analysis(self):
        """Test Anthropic text analysis."""
        from app.mcp.anthropic_client import anthropic_mcp
        
        anthropic_mcp.client = AsyncMock()
        anthropic_mcp.client.messages.create = AsyncMock(
            return_value=MagicMock(
                content=[MagicMock(text='Sentiment analysis: positive')]
            )
        )
        
        result = await anthropic_mcp.analyze_text('Test text', 'detect_sentiment')
        
        assert 'positive' in result.lower()
    
    @pytest.mark.asyncio
    async def test_anthropic_transcript_analysis(self):
        """Test Anthropic transcript analysis."""
        from app.mcp.anthropic_client import anthropic_mcp
        
        anthropic_mcp.client = AsyncMock()
        anthropic_mcp.client.messages.create = AsyncMock(
            return_value=MagicMock(
                content=[MagicMock(text='Summary of transcript')]
            )
        )
        
        result = await anthropic_mcp.analyze_transcript(
            'Test transcript',
            include_summary=True
        )
        
        assert 'summary' in result


class TestMCPManager:
    """Tests for MCP Manager."""
    
    @pytest.mark.asyncio
    async def test_mcp_manager_initialization(self):
        """Test MCP manager initialization."""
        from app.mcp.manager import mcp_manager
        
        assert mcp_manager.services is not None
        assert 'database' in mcp_manager.services
        assert 'redis' in mcp_manager.services
        assert 'storage' in mcp_manager.services
        assert 'openai' in mcp_manager.services
        assert 'anthropic' in mcp_manager.services
    
    @pytest.mark.asyncio
    async def test_mcp_manager_health_check(self):
        """Test MCP manager health check."""
        from app.mcp.manager import mcp_manager
        
        # Mock all services
        with patch.object(mcp_manager.services['database'], 'health_check', return_value={'status': 'healthy'}):
            with patch.object(mcp_manager.services['redis'], 'health_check', return_value={'status': 'healthy'}):
                with patch.object(mcp_manager.services['storage'], 'health_check', return_value={'status': 'healthy'}):
                    result = await mcp_manager.health_check()
                    
                    assert result['overall'] == 'healthy'
                    assert 'services' in result
    
    @pytest.mark.asyncio
    async def test_mcp_manager_shutdown(self):
        """Test MCP manager shutdown."""
        from app.mcp.manager import mcp_manager
        
        with patch.object(mcp_manager.services['database'], 'disconnect') as mock_disconnect:
            with patch.object(mcp_manager.services['redis'], 'disconnect') as mock_redis_disconnect:
                await mcp_manager.shutdown()
                
                mock_disconnect.assert_called_once()
                mock_redis_disconnect.assert_called_once()
