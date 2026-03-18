from fastapi import APIRouter, Depends
from app.mcp.manager import mcp_manager

router = APIRouter()


@router.get("/")
async def mcp_health():
    """Health check for all MCP services."""
    return await mcp_manager.health_check()


@router.get("/database")
async def database_health():
    """Health check for database MCP."""
    from app.mcp.database import db_mcp
    return await db_mcp.health_check()


@router.get("/redis")
async def redis_health():
    """Health check for Redis MCP."""
    from app.mcp.redis_client import redis_mcp
    return await redis_mcp.health_check()


@router.get("/storage")
async def storage_health():
    """Health check for R2 storage MCP."""
    from app.mcp.storage import r2_storage_mcp
    return await r2_storage_mcp.health_check()


@router.get("/openai")
async def openai_health():
    """Health check for OpenAI MCP."""
    from app.mcp.openai_client import openai_mcp
    return await openai_mcp.health_check()


@router.get("/anthropic")
async def anthropic_health():
    """Health check for Anthropic MCP."""
    from app.mcp.anthropic_client import anthropic_mcp
    return await anthropic_mcp.health_check()
