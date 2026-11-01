import os
import uuid
import logging
from django.conf import settings
from django.core.files.storage import default_storage

logger = logging.getLogger(__name__)


class S3Service:
    def __init__(self):
        self.bucket = getattr(settings, 'AWS_S3_BUCKET', 'food-ordering-platform-uploads')
        self.region = getattr(settings, 'AWS_REGION', 'us-east-1')
        self.access_key = getattr(settings, 'AWS_ACCESS_KEY_ID', '')
        self.secret_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY', '')
        self.client = None

        if self.access_key and self.secret_key:
            try:
                import boto3
                self.client = boto3.client(
                    's3',
                    region_name=self.region,
                    aws_access_key_id=self.access_key,
                    aws_secret_access_key=self.secret_key
                )
            except Exception as e:
                logger.warning(f"Could not initialize boto3 S3 client: {e}")

    def is_configured(self) -> bool:
        return bool(self.client and self.access_key)

    def upload_file(self, file_obj, prefix: str = 'menu') -> str:
        ext = file_obj.name.split('.')[-1].lower() if '.' in file_obj.name else 'jpg'
        filename = f"{prefix}/{uuid.uuid4().hex}.{ext}"

        if self.is_configured():
            try:
                self.client.upload_fileobj(
                    file_obj,
                    self.bucket,
                    filename,
                    ExtraArgs={'ContentType': getattr(file_obj, 'content_type', 'image/jpeg')}
                )
                return f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{filename}"
            except Exception as e:
                logger.error(f"S3 upload failed, falling back to local media: {e}")

        # Local storage fallback
        saved_path = default_storage.save(filename, file_obj)
        return default_storage.url(saved_path)


s3_service = S3Service()

