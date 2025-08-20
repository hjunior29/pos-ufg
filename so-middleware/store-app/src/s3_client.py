import boto3
import pandas as pd
import logging
from datetime import datetime
from typing import List, Dict
from botocore.exceptions import ClientError
from io import BytesIO
from opentelemetry import trace

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)

class S3ParquetWriter:
    def __init__(self, endpoint: str, access_key: str, secret_key: str, 
                 bucket: str, use_ssl: bool = False):
        self.bucket = bucket
        
        # Initialize S3 client for MinIO
        self.s3_client = boto3.client(
            's3',
            endpoint_url=f"{'https' if use_ssl else 'http'}://{endpoint}",
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name='us-east-1'  # MinIO default region
        )
        
        # Create bucket if it doesn't exist
        self._create_bucket_if_not_exists()
        logger.info(f"S3 client initialized for bucket: {bucket}")
    
    def _create_bucket_if_not_exists(self):
        """Create bucket if it doesn't exist"""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket)
            logger.info(f"Bucket {self.bucket} already exists")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == '404':
                try:
                    self.s3_client.create_bucket(Bucket=self.bucket)
                    logger.info(f"Created bucket: {self.bucket}")
                except ClientError as create_error:
                    logger.error(f"Error creating bucket: {create_error}")
                    raise
            else:
                logger.error(f"Error checking bucket: {e}")
                raise
    
    def write_parquet_batch(self, records: List[Dict], source_file: str) -> str:
        """Write batch of records to S3 as Parquet file"""
        with tracer.start_as_current_span("write_parquet_to_s3") as span:
            span.set_attribute("bucket", self.bucket)
            span.set_attribute("source_file", source_file)
            span.set_attribute("record_count", len(records))
            
            try:
                # Convert records to DataFrame
                df = pd.DataFrame(records)
                
                # Generate unique filename with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                file_key = f"census-data/{source_file.replace('.csv', '')}/{timestamp}.parquet"
                
                # Convert DataFrame to Parquet in memory
                parquet_buffer = BytesIO()
                df.to_parquet(parquet_buffer, engine='pyarrow', index=False, compression='snappy')
                parquet_buffer.seek(0)
                
                # Upload to S3
                self.s3_client.upload_fileobj(
                    parquet_buffer,
                    self.bucket,
                    file_key,
                    ExtraArgs={'ContentType': 'application/octet-stream'}
                )
                
                span.set_attribute("s3_key", file_key)
                logger.info(f"Successfully uploaded {len(records)} records to s3://{self.bucket}/{file_key}")
                
                return file_key
                
            except Exception as e:
                span.record_exception(e)
                span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
                logger.error(f"Error writing to S3: {str(e)}")
                raise
    
    def append_to_existing_parquet(self, records: List[Dict], base_key: str) -> str:
        """Append records to existing Parquet files (simplified approach)"""
        # For simplicity, we'll create new files with timestamps
        # In production, you might want to implement proper append logic
        # using tools like Delta Lake or Apache Iceberg
        return self.write_parquet_batch(records, base_key)