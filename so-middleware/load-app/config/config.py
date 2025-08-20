import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
    KAFKA_TOPIC = os.getenv('KAFKA_TOPIC', 'census-data')
    CSV_DATA_PATH = os.getenv('CSV_DATA_PATH', '/app/data')
    BATCH_SIZE = int(os.getenv('BATCH_SIZE', '1000'))
    
    # Tracing configuration
    JAEGER_ENDPOINT = os.getenv('JAEGER_ENDPOINT', 'http://localhost:14268/api/traces')
    SERVICE_NAME = os.getenv('SERVICE_NAME', 'load-app')