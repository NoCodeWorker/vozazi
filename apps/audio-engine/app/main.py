from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from app.config import settings
from app.api import audio, health, websocket, mcp
from app.mcp.manager import mcp_manager

logger = structlog.get_logger()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title="VOZAZI Audio Engine",
        description="Audio processing and AI-powered voice analysis API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(health.router, prefix="/health", tags=["health"])
    app.include_router(audio.router, prefix="/api/v1/audio", tags=["audio"])
    app.include_router(websocket.router, prefix="/ws", tags=["websocket"])
    app.include_router(mcp.router, prefix="/mcp/health", tags=["mcp-health"])
    
    @app.on_event("startup")
    async def startup_event():
        logger.info("VOZAZI Audio Engine starting up", host=settings.HOST, port=settings.PORT)
        # Initialize MCP services
        await mcp_manager.initialize()
    
    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("VOZAZI Audio Engine shutting down")
        # Shutdown MCP services
        await mcp_manager.shutdown()
    
    return app


app = create_app()
