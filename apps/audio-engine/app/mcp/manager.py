"""
MCP Services Manager.

This module initializes and manages all MCP (Model Context Protocol) clients
for the audio-engine service.
"""

import structlog
from typing import Dict, Any

from app.mcp.database import db_mcp
from app.mcp.redis_client import redis_mcp
from app.mcp.storage import r2_storage_mcp
from app.mcp.openai_client import openai_mcp
from app.mcp.anthropic_client import anthropic_mcp

logger = structlog.get_logger()


class MCPManager:
    """
    Manages all MCP service connections and lifecycle.
    """
    
    _instance: "MCPManager" = None
    
    def __new__(cls) -> "MCPManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self) -> None:
        self.services: Dict[str, Any] = {
            "database": db_mcp,
            "redis": redis_mcp,
            "storage": r2_storage_mcp,
            "openai": openai_mcp,
            "anthropic": anthropic_mcp
        }
        self._initialized = False
    
    async def initialize(self) -> None:
        """Initialize all MCP services."""
        if self._initialized:
            logger.info("MCP Manager already initialized")
            return
        
        logger.info("Initializing MCP services...")
        
        # Initialize database
        try:
            await db_mcp.connect()
            logger.info("Database MCP initialized")
        except Exception as e:
            logger.error("Failed to initialize Database MCP", error=str(e))
        
        # Initialize Redis
        try:
            await redis_mcp.connect()
            logger.info("Redis MCP initialized")
        except Exception as e:
            logger.error("Failed to initialize Redis MCP", error=str(e))
        
        # R2, OpenAI, and Anthropic don't need explicit connection
        logger.info("MCP services initialization complete")
        self._initialized = True
    
    async def shutdown(self) -> None:
        """Shutdown all MCP services."""
        if not self._initialized:
            return
        
        logger.info("Shutting down MCP services...")
        
        # Close database connections
        try:
            await db_mcp.disconnect()
        except Exception as e:
            logger.error("Error shutting down Database MCP", error=str(e))
        
        # Close Redis connections
        try:
            await redis_mcp.disconnect()
        except Exception as e:
            logger.error("Error shutting down Redis MCP", error=str(e))
        
        logger.info("MCP services shutdown complete")
        self._initialized = False
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Perform health check on all MCP services.
        
        Returns:
            dict with health status for each service
        """
        results = {}
        overall_healthy = True
        
        # Database health
        if hasattr(db_mcp, 'health_check'):
            results["database"] = await db_mcp.health_check()
            if results["database"]["status"] != "healthy":
                overall_healthy = False
        
        # Redis health
        if hasattr(redis_mcp, 'health_check'):
            results["redis"] = await redis_mcp.health_check()
            if results["redis"]["status"] != "healthy":
                overall_healthy = False
        
        # Storage health
        if hasattr(r2_storage_mcp, 'health_check'):
            results["storage"] = await r2_storage_mcp.health_check()
            if results["storage"]["status"] != "healthy":
                overall_healthy = False
        
        # OpenAI health
        if hasattr(openai_mcp, 'health_check'):
            results["openai"] = await openai_mcp.health_check()
            # OpenAI being unhealthy doesn't mean overall unhealthy (it's optional)
        
        # Anthropic health
        if hasattr(anthropic_mcp, 'health_check'):
            results["anthropic"] = await anthropic_mcp.health_check()
            # Anthropic being unhealthy doesn't mean overall unhealthy (it's optional)
        
        return {
            "overall": "healthy" if overall_healthy else "degraded",
            "services": results
        }


# Global manager instance
mcp_manager = MCPManager()
