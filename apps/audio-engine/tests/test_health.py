"""
Health Check Tests for VOZAZI Audio Engine.

Tests for health and readiness endpoints.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
async def client():
    """Create an async test client."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac


class TestHealthEndpoints:
    """Test health check endpoints."""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client: AsyncClient):
        """Test the main health check endpoint."""
        response = await client.get("/health/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    @pytest.mark.asyncio
    async def test_readiness_check(self, client: AsyncClient):
        """Test the readiness check endpoint."""
        response = await client.get("/health/ready")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ready"
    
    @pytest.mark.asyncio
    async def test_health_check_format(self, client: AsyncClient):
        """Test health check response format."""
        response = await client.get("/health/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "status" in data
        assert isinstance(data["status"], str)
    
    @pytest.mark.asyncio
    async def test_health_check_content_type(self, client: AsyncClient):
        """Test health check content type."""
        response = await client.get("/health/")
        
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]


class TestMCPHealthEndpoints:
    """Test MCP health check endpoints."""
    
    @pytest.mark.asyncio
    async def test_mcp_health_main(self, client: AsyncClient):
        """Test the main MCP health endpoint."""
        response = await client.get("/mcp/health/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "overall" in data
        assert "services" in data
    
    @pytest.mark.asyncio
    async def test_mcp_health_database(self, client: AsyncClient):
        """Test database MCP health endpoint."""
        response = await client.get("/mcp/health/database")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "status" in data
        assert data["status"] in ["healthy", "unhealthy", "unavailable"]
    
    @pytest.mark.asyncio
    async def test_mcp_health_redis(self, client: AsyncClient):
        """Test Redis MCP health endpoint."""
        response = await client.get("/mcp/health/redis")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "status" in data
        assert data["status"] in ["healthy", "unhealthy", "unavailable"]
    
    @pytest.mark.asyncio
    async def test_mcp_health_storage(self, client: AsyncClient):
        """Test storage MCP health endpoint."""
        response = await client.get("/mcp/health/storage")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "status" in data
        assert data["status"] in ["healthy", "unhealthy", "unavailable"]
    
    @pytest.mark.asyncio
    async def test_mcp_health_openai(self, client: AsyncClient):
        """Test OpenAI MCP health endpoint."""
        response = await client.get("/mcp/health/openai")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "status" in data
        assert data["status"] in ["healthy", "unhealthy", "unavailable"]
    
    @pytest.mark.asyncio
    async def test_mcp_health_anthropic(self, client: AsyncClient):
        """Test Anthropic MCP health endpoint."""
        response = await client.get("/mcp/health/anthropic")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "status" in data
        assert data["status"] in ["healthy", "unhealthy", "unavailable"]
