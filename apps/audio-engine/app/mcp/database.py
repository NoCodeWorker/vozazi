"""
MCP Client for PostgreSQL Database Connection.

This module provides a connection pool and utilities for interacting
with the PostgreSQL database using asyncpg and SQLAlchemy.
"""

import asyncio
from typing import Optional, Any
from contextlib import asynccontextmanager
import asyncpg
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import structlog

from app.config import settings

logger = structlog.get_logger()

Base = declarative_base()


class DatabaseMCP:
    """
    Model Context Protocol (MCP) client for PostgreSQL.
    
    Manages database connections, connection pooling, and provides
    utilities for database operations.
    """
    
    _instance: Optional["DatabaseMCP"] = None
    _initialized: bool = False
    
    def __new__(cls) -> "DatabaseMCP":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self) -> None:
        if not self._initialized:
            self.engine = None
            self.async_session_maker = None
            self.pool = None
            self._initialized = True
    
    async def connect(self) -> None:
        """Initialize database connection pool."""
        try:
            # Create async engine with SQLAlchemy
            self.engine = create_async_engine(
                settings.DATABASE_URL,
                pool_size=20,
                max_overflow=40,
                pool_pre_ping=True,
                pool_recycle=3600,
                echo=settings.LOG_LEVEL == "DEBUG"
            )
            
            # Create session factory
            self.async_session_maker = async_sessionmaker(
                self.engine,
                class_=AsyncSession,
                expire_on_commit=False,
                autocommit=False,
                autoflush=False
            )
            
            # Create asyncpg pool for direct queries
            self.pool = await asyncpg.create_pool(
                settings.DATABASE_URL,
                min_size=5,
                max_size=20,
                command_timeout=60
            )
            
            logger.info("Database MCP connected successfully")
            
        except Exception as e:
            logger.error("Failed to connect to database", error=str(e))
            raise
    
    async def disconnect(self) -> None:
        """Close all database connections."""
        try:
            if self.engine:
                await self.engine.dispose()
            if self.pool:
                await self.pool.close()
            logger.info("Database MCP disconnected")
        except Exception as e:
            logger.error("Error disconnecting from database", error=str(e))
    
    @asynccontextmanager
    async def get_session(self):
        """Get a database session from the pool."""
        session = self.async_session_maker()
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
    
    @asynccontextmanager
    async def get_connection(self):
        """Get a direct connection from the pool."""
        async with self.pool.acquire() as connection:
            yield connection
    
    async def execute_query(self, query: str, params: Optional[tuple] = None) -> list:
        """Execute a raw SQL query."""
        async with self.get_connection() as conn:
            if params:
                rows = await conn.fetch(query, *params)
            else:
                rows = await conn.fetch(query)
            return [dict(row) for row in rows]
    
    async def execute_one(self, query: str, params: Optional[tuple] = None) -> Optional[dict]:
        """Execute a raw SQL query and return one result."""
        async with self.get_connection() as conn:
            if params:
                row = await conn.fetchrow(query, *params)
            else:
                row = await conn.fetchrow(query)
            return dict(row) if row else None
    
    async def health_check(self) -> dict:
        """Check database connection health."""
        try:
            async with self.get_connection() as conn:
                await conn.fetchval("SELECT 1")
            return {
                "status": "healthy",
                "service": "postgresql",
                "version": await self.get_version()
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "postgresql",
                "error": str(e)
            }
    
    async def get_version(self) -> str:
        """Get PostgreSQL version."""
        async with self.get_connection() as conn:
            return await conn.fetchval("SELECT version()")
    
    async def check_extensions(self) -> list:
        """Check installed PostgreSQL extensions."""
        query = """
            SELECT extname, extversion 
            FROM pg_extension 
            WHERE extname IN ('vector', 'uuid-ossp', 'pg_trgm')
        """
        return await self.execute_query(query)


# Global instance
db_mcp = DatabaseMCP()


@asynccontextmanager
async def get_db():
    """Dependency for FastAPI routes."""
    async with db_mcp.get_session() as session:
        yield session
