import os
import sys
import logging
import signal
from typing import List, Dict

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from config.config import Config
from src.tracing import setup_tracing
from src.kafka_consumer import KafkaDataConsumer
from src.s3_client import S3ParquetWriter

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class StoreApp:
    def __init__(self):
        self.tracer = setup_tracing(Config.SERVICE_NAME, Config.JAEGER_ENDPOINT)
        self.running = True
        
        # Initialize S3 client
        self.s3_writer = S3ParquetWriter(
            Config.S3_ENDPOINT,
            Config.S3_ACCESS_KEY,
            Config.S3_SECRET_KEY,
            Config.S3_BUCKET,
            Config.S3_USE_SSL
        )
        
        # Initialize Kafka consumer
        self.kafka_consumer = KafkaDataConsumer(
            Config.KAFKA_BOOTSTRAP_SERVERS,
            Config.KAFKA_TOPIC,
            Config.KAFKA_GROUP_ID,
            Config.BATCH_SIZE,
            Config.FLUSH_INTERVAL
        )
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"Received signal {signum}, initiating graceful shutdown...")
        self.running = False
        self.kafka_consumer.stop()
    
    def process_batch(self, records: List[Dict], source_file: str):
        """Process a batch of records by storing them to S3"""
        with self.tracer.start_as_current_span("process_and_store_batch") as span:
            span.set_attribute("source_file", source_file)
            span.set_attribute("record_count", len(records))
            
            try:
                # Store batch to S3 as Parquet
                s3_key = self.s3_writer.write_parquet_batch(records, source_file)
                
                span.set_attribute("s3_key", s3_key)
                logger.info(f"Successfully stored {len(records)} records from {source_file} to S3: {s3_key}")
                
            except Exception as e:
                span.record_exception(e)
                logger.error(f"Error processing batch from {source_file}: {str(e)}")
                raise
    
    def run(self):
        """Run the store application"""
        with self.tracer.start_as_current_span("store_app_main") as span:
            try:
                logger.info("Starting Store App")
                span.set_attribute("service.name", Config.SERVICE_NAME)
                
                # Start consuming and processing messages
                self.kafka_consumer.consume_and_process(self.process_batch)
                
                logger.info("Store App stopped gracefully")
                
            except Exception as e:
                span.record_exception(e)
                logger.error(f"Error in Store App: {str(e)}")
                raise
            finally:
                self.kafka_consumer.close()

def main():
    app = StoreApp()
    app.run()

if __name__ == "__main__":
    main()