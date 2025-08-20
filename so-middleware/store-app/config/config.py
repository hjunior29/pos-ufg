import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
    KAFKA_TOPIC = os.getenv('KAFKA_TOPIC', 'census-data')
    KAFKA_GROUP_ID = os.getenv('KAFKA_GROUP_ID', 'store-app-group')
    
    # MinIO S3 Configuration
    S3_ENDPOINT = os.getenv('S3_ENDPOINT', 'localhost:9000')
    S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY', 'minioadmin')
    S3_SECRET_KEY = os.getenv('S3_SECRET_KEY', 'minioadmin')
    S3_BUCKET = os.getenv('S3_BUCKET', 'census-data')
    S3_USE_SSL = os.getenv('S3_USE_SSL', 'false').lower() == 'true'
    
    # Processing Configuration
    BATCH_SIZE = int(os.getenv('BATCH_SIZE', '1000'))
    FLUSH_INTERVAL = int(os.getenv('FLUSH_INTERVAL', '30'))  # seconds
    
    # Tracing configuration
    JAEGER_ENDPOINT = os.getenv('JAEGER_ENDPOINT', 'http://localhost:14268/api/traces')
    SERVICE_NAME = os.getenv('SERVICE_NAME', 'store-app')