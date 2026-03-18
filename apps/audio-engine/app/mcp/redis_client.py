"""
MCP Client for Redis Cache and Pub/Sub.

This module provides Redis connection management, caching utilities,
and pub/sub functionality for real-time features.
"""

import json
import asyncio
from typing import Optional, Any, Dict
from contextlib import asynccontextmanager
import redis.asyncio as redis
import structlog

from app.config import settings

logger = structlog.get_logger()


class RedisMCP:
    """
    Model Context Protocol (MCP) client for Redis.
    
    Manages Redis connections, provides caching utilities,
    and handles pub/sub for real-time communication.
    """
    
    _instance: Optional["RedisMCP"] = None
    _initialized: bool = False
    
    def __new__(cls) -> "RedisMCP":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self) -> None:
        if not self._initialized:
            self.client: Optional[redis.Redis] = None
            self.pubsub = None
            self._initialized = True
    
    async def connect(self) -> None:
        """Initialize Redis connection."""
        try:
            self.client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=5,
                socket_keepalive=True
            )
            
            # Test connection
            await self.client.ping()
            logger.info("Redis MCP connected successfully")
            
        except Exception as e:
            logger.error("Failed to connect to Redis", error=str(e))
            raise
    
    async def disconnect(self) -> None:
        """Close Redis connection."""
        try:
            if self.pubsub:
                await self.pubsub.close()
            if self.client:
                await self.client.close()
            logger.info("Redis MCP disconnected")
        except Exception as e:
            logger.error("Error disconnecting from Redis", error=str(e))
    
    async def health_check(self) -> dict:
        """Check Redis connection health."""
        try:
            await self.client.ping()
            info = await self.client.info("server")
            return {
                "status": "healthy",
                "service": "redis",
                "version": info.get("redis_version", "unknown")
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "redis",
                "error": str(e)
            }
    
    # Cache Operations
    
    async def get(self, key: str) -> Optional[Any]:
        """Get a value from cache."""
        try:
            value = await self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error("Redis GET error", key=key, error=str(e))
            return None
    
    async def set(
        self,
        key: str,
        value: Any,
        expire: Optional[int] = None
    ) -> bool:
        """Set a value in cache with optional expiration."""
        try:
            serialized = json.dumps(value)
            if expire:
                await self.client.setex(key, expire, serialized)
            else:
                await self.client.set(key, serialized)
            return True
        except Exception as e:
            logger.error("Redis SET error", key=key, error=str(e))
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete a key from cache."""
        try:
            await self.client.delete(key)
            return True
        except Exception as e:
            logger.error("Redis DELETE error", key=key, error=str(e))
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if a key exists."""
        try:
            return await self.client.exists(key) > 0
        except Exception as e:
            logger.error("Redis EXISTS error", key=key, error=str(e))
            return False
    
    # Cache Patterns
    
    async def get_pattern(self, pattern: str) -> list:
        """Get all keys matching a pattern."""
        try:
            return await self.client.keys(pattern)
        except Exception as e:
            logger.error("Redis PATTERN error", pattern=pattern, error=str(e))
            return []
    
    async def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching a pattern."""
        try:
            keys = await self.client.keys(pattern)
            if keys:
                return await self.client.delete(*keys)
            return 0
        except Exception as e:
            logger.error("Redis DELETE_PATTERN error", pattern=pattern, error=str(e))
            return 0
    
    # Hash Operations
    
    async def hget(self, name: str, key: str) -> Optional[Any]:
        """Get a field from a hash."""
        try:
            value = await self.client.hget(name, key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error("Redis HGET error", name=name, key=key, error=str(e))
            return None
    
    async def hset(self, name: str, key: str, value: Any) -> bool:
        """Set a field in a hash."""
        try:
            serialized = json.dumps(value)
            await self.client.hset(name, key, serialized)
            return True
        except Exception as e:
            logger.error("Redis HSET error", name=name, key=key, error=str(e))
            return False
    
    async def hgetall(self, name: str) -> Dict:
        """Get all fields from a hash."""
        try:
            data = await self.client.hgetall(name)
            return {k: json.loads(v) for k, v in data.items()}
        except Exception as e:
            logger.error("Redis HGETALL error", name=name, error=str(e))
            return {}
    
    # Rate Limiting
    
    async def rate_limit(
        self,
        identifier: str,
        max_requests: int = 60,
        window_seconds: int = 60
    ) -> tuple[bool, int]:
        """
        Check and update rate limit.
        
        Returns:
            tuple: (allowed: bool, remaining: int)
        """
        key = f"rate_limit:{identifier}"
        current = await self.client.get(key)
        
        if current is None:
            await self.client.setex(key, window_seconds, 1)
            return (True, max_requests - 1)
        
        current_count = int(current)
        if current_count >= max_requests:
            ttl = await self.client.ttl(key)
            return (False, 0)
        
        await self.client.incr(key)
        return (True, max_requests - current_count - 1)
    
    # Pub/Sub
    
    async def publish(self, channel: str, message: dict) -> int:
        """Publish a message to a channel."""
        try:
            serialized = json.dumps(message)
            return await self.client.publish(channel, serialized)
        except Exception as e:
            logger.error("Redis PUBLISH error", channel=channel, error=str(e))
            return 0
    
    async def subscribe(self, channel: str):
        """Subscribe to a channel."""
        try:
            self.pubsub = self.client.pubsub()
            await self.pubsub.subscribe(channel)
            return self.pubsub
        except Exception as e:
            logger.error("Redis SUBSCRIBE error", channel=channel, error=str(e))
            return None
    
    async def unsubscribe(self, channel: str) -> None:
        """Unsubscribe from a channel."""
        try:
            if self.pubsub:
                await self.pubsub.unsubscribe(channel)
        except Exception as e:
            logger.error("Redis UNSUBSCRIBE error", channel=channel, error=str(e))


# Global instance
redis_mcp = RedisMCP()


@asynccontextmanager
async def get_redis():
    """Dependency for FastAPI routes."""
    yield redis_mcp
