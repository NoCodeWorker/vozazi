"""
MCP Client for Cloudflare R2 Storage.

This module provides S3-compatible storage operations for uploading,
downloading, and managing audio files in Cloudflare R2.
"""

import asyncio
from typing import Optional, Dict, Any, BinaryIO
from datetime import timedelta
import structlog
from botocore.config import Config
import aioboto3
from botocore.exceptions import ClientError

from app.config import settings

logger = structlog.get_logger()


class R2StorageMCP:
    """
    Model Context Protocol (MCP) client for Cloudflare R2 Storage.
    
    Provides S3-compatible operations for file storage including
    uploads, downloads, presigned URLs, and bucket management.
    """
    
    _instance: Optional["R2StorageMCP"] = None
    _initialized: bool = False
    
    def __new__(cls) -> "R2StorageMCP":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self) -> None:
        if not self._initialized:
            self.endpoint_url = f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
            self.session = None
            self._initialized = True
    
    def _get_session(self) -> aioboto3.Session:
        """Get or create boto3 session."""
        if self.session is None:
            self.session = aioboto3.Session()
        return self.session
    
    def _get_client_config(self) -> Config:
        """Get botocore configuration."""
        return Config(
            signature_version="s3v4",
            retries={"max_attempts": 3, "mode": "standard"},
            connect_timeout=5,
            read_timeout=30
        )
    
    async def health_check(self) -> dict:
        """Check R2 storage connection health."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                await client.head_bucket(Bucket=settings.R2_BUCKET_NAME)
            return {
                "status": "healthy",
                "service": "r2_storage",
                "bucket": settings.R2_BUCKET_NAME
            }
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "Unknown")
            return {
                "status": "unhealthy",
                "service": "r2_storage",
                "error": str(e),
                "error_code": error_code
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "r2_storage",
                "error": str(e)
            }
    
    async def upload_file(
        self,
        file_key: str,
        file_content: bytes,
        content_type: str = "application/octet-stream",
        metadata: Optional[Dict[str, str]] = None
    ) -> dict:
        """
        Upload a file to R2 storage.
        
        Args:
            file_key: The key (path) for the file in the bucket
            file_content: The file content as bytes
            content_type: MIME type of the file
            metadata: Optional metadata to attach to the file
        
        Returns:
            dict with upload result including ETag and URL
        """
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                upload_params = {
                    "Bucket": settings.R2_BUCKET_NAME,
                    "Key": file_key,
                    "Body": file_content,
                    "ContentType": content_type
                }
                
                if metadata:
                    upload_params["Metadata"] = metadata
                
                response = await client.put_object(**upload_params)
                
                file_url = f"https://{settings.R2_BUCKET_NAME}.{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/{file_key}"
                
                logger.info("File uploaded to R2", file_key=file_key, size=len(file_content))
                
                return {
                    "success": True,
                    "file_key": file_key,
                    "etag": response.get("ETag", "").strip('"'),
                    "url": file_url
                }
                
        except ClientError as e:
            logger.error("R2 upload failed", file_key=file_key, error=str(e))
            return {
                "success": False,
                "error": str(e),
                "error_code": e.response.get("Error", {}).get("Code", "Unknown")
            }
        except Exception as e:
            logger.error("R2 upload failed", file_key=file_key, error=str(e))
            return {
                "success": False,
                "error": str(e)
            }
    
    async def upload_file_stream(
        self,
        file_key: str,
        file_obj: BinaryIO,
        content_type: str = "application/octet-stream",
        metadata: Optional[Dict[str, str]] = None
    ) -> dict:
        """Upload a file using a file-like object."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                upload_params = {
                    "Bucket": settings.R2_BUCKET_NAME,
                    "Key": file_key,
                    "Body": file_obj,
                    "ContentType": content_type
                }
                
                if metadata:
                    upload_params["Metadata"] = metadata
                
                response = await client.put_object(**upload_params)
                
                file_url = f"https://{settings.R2_BUCKET_NAME}.{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/{file_key}"
                
                return {
                    "success": True,
                    "file_key": file_key,
                    "etag": response.get("ETag", "").strip('"'),
                    "url": file_url
                }
                
        except Exception as e:
            logger.error("R2 upload failed", file_key=file_key, error=str(e))
            return {
                "success": False,
                "error": str(e)
            }
    
    async def download_file(self, file_key: str) -> Optional[bytes]:
        """Download a file from R2 storage."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                response = await client.get_object(
                    Bucket=settings.R2_BUCKET_NAME,
                    Key=file_key
                )
                return await response["Body"].read()
                
        except ClientError as e:
            logger.error("R2 download failed", file_key=file_key, error=str(e))
            return None
        except Exception as e:
            logger.error("R2 download failed", file_key=file_key, error=str(e))
            return None
    
    async def delete_file(self, file_key: str) -> bool:
        """Delete a file from R2 storage."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                await client.delete_object(
                    Bucket=settings.R2_BUCKET_NAME,
                    Key=file_key
                )
                logger.info("File deleted from R2", file_key=file_key)
                return True
                
        except Exception as e:
            logger.error("R2 delete failed", file_key=file_key, error=str(e))
            return False
    
    async def delete_files(self, file_keys: list) -> dict:
        """Delete multiple files from R2 storage."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                objects_to_delete = [{"Key": key} for key in file_keys]
                
                response = await client.delete_objects(
                    Bucket=settings.R2_BUCKET_NAME,
                    Delete={"Objects": objects_to_delete}
                )
                
                deleted = [d.get("Key") for d in response.get("Deleted", [])]
                errors = response.get("Errors", [])
                
                logger.info("Files deleted from R2", deleted=deleted, errors=errors)
                
                return {
                    "success": len(errors) == 0,
                    "deleted": deleted,
                    "errors": errors
                }
                
        except Exception as e:
            logger.error("R2 batch delete failed", error=str(e))
            return {
                "success": False,
                "deleted": [],
                "errors": [{"error": str(e)}]
            }
    
    async def file_exists(self, file_key: str) -> bool:
        """Check if a file exists in R2 storage."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                await client.head_object(
                    Bucket=settings.R2_BUCKET_NAME,
                    Key=file_key
                )
                return True
                
        except ClientError as e:
            if e.response.get("Error", {}).get("Code") == "404":
                return False
            logger.error("R2 exists check failed", file_key=file_key, error=str(e))
            return False
        except Exception as e:
            logger.error("R2 exists check failed", file_key=file_key, error=str(e))
            return False
    
    async def get_file_metadata(self, file_key: str) -> Optional[Dict[str, Any]]:
        """Get metadata for a file in R2 storage."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                response = await client.head_object(
                    Bucket=settings.R2_BUCKET_NAME,
                    Key=file_key
                )
                return {
                    "content_type": response.get("ContentType"),
                    "content_length": response.get("ContentLength"),
                    "last_modified": response.get("LastModified"),
                    "etag": response.get("ETag", "").strip('"'),
                    "metadata": response.get("Metadata", {})
                }
                
        except Exception as e:
            logger.error("R2 metadata fetch failed", file_key=file_key, error=str(e))
            return None
    
    async def generate_presigned_url(
        self,
        file_key: str,
        expiration: int = 3600,
        client_method: str = "get_object"
    ) -> Optional[str]:
        """
        Generate a presigned URL for file access.
        
        Args:
            file_key: The key of the file
            expiration: URL expiration time in seconds
            client_method: The method to use (get_object, put_object)
        
        Returns:
            Presigned URL string
        """
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                url = await client.generate_presigned_url(
                    ClientMethod=client_method,
                    Params={
                        "Bucket": settings.R2_BUCKET_NAME,
                        "Key": file_key
                    },
                    ExpiresIn=expiration
                )
                return url
                
        except Exception as e:
            logger.error("R2 presigned URL generation failed", file_key=file_key, error=str(e))
            return None
    
    async def generate_presigned_upload_url(
        self,
        file_key: str,
        content_type: str,
        expiration: int = 3600
    ) -> Optional[str]:
        """Generate a presigned URL for uploading."""
        return await self.generate_presigned_url(
            file_key=file_key,
            expiration=expiration,
            client_method="put_object"
        )
    
    async def list_files(
        self,
        prefix: str = "",
        max_keys: int = 100
    ) -> list:
        """List files in the bucket with optional prefix."""
        try:
            session = self._get_session()
            async with session.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=self._get_client_config()
            ) as client:
                response = await client.list_objects_v2(
                    Bucket=settings.R2_BUCKET_NAME,
                    Prefix=prefix,
                    MaxKeys=max_keys
                )
                
                files = []
                for obj in response.get("Contents", []):
                    files.append({
                        "key": obj["Key"],
                        "size": obj["Size"],
                        "last_modified": obj["LastModified"],
                        "etag": obj["ETag"].strip('"')
                    })
                
                return files
                
        except Exception as e:
            logger.error("R2 list files failed", error=str(e))
            return []


# Global instance
r2_storage_mcp = R2StorageMCP()
