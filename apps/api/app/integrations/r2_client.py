"""R2/S3 upload stub — swap with real boto3/r2 client in production."""
from __future__ import annotations

import base64
import logging
import os
import uuid
from typing import Optional

logger = logging.getLogger(__name__)


async def upload_bytes(
    bucket: str,
    key: str,
    data: bytes,
    content_type: str = "application/octet-stream",
) -> str:
    """
    Upload bytes to object storage. Returns public URL.
    Production: use boto3 with R2 credentials from env.
    Dev fallback: return a data: URL so preview still works.
    """
    access_key = os.getenv("R2_ACCESS_KEY_ID") or os.getenv("AWS_ACCESS_KEY_ID")
    cdn_base = os.getenv("R2_PUBLIC_URL") or os.getenv("CDN_BASE_URL")

    if access_key and cdn_base:
        try:
            import boto3
            s3 = boto3.client(
                "s3",
                endpoint_url=os.getenv("R2_ENDPOINT"),
                aws_access_key_id=access_key,
                aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY") or os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION", "auto"),
            )
            s3.put_object(Bucket=bucket, Key=key, Body=data, ContentType=content_type)
            url = f"{cdn_base.rstrip('/')}/{key}"
            logger.info("[r2] uploaded %s → %s", key, url)
            return url
        except Exception as e:
            logger.warning("[r2] upload failed (%s) — falling back to data URL", e)

    # Dev fallback
    b64 = base64.b64encode(data).decode("ascii")
    return f"data:{content_type};base64,{b64}"


def gen_asset_key(tenant_id: str, ext: str = "jpg") -> str:
    return f"{tenant_id}/hero-{uuid.uuid4().hex}.{ext}"
