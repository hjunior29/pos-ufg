import json
import logging
from kafka import KafkaProducer
from typing import List, Dict
from opentelemetry import trace

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)

class KafkaDataProducer:
    def __init__(self, bootstrap_servers: str, topic: str):
        self.topic = topic
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None,
            acks='all',
            retries=3,
            batch_size=16384,
            linger_ms=10
        )
        logger.info(f"Kafka producer initialized for topic: {topic}")
    
    def send_batch(self, records: List[Dict], file_name: str) -> None:
        """Send a batch of records to Kafka"""
        with tracer.start_as_current_span("send_batch_to_kafka") as span:
            span.set_attribute("topic", self.topic)
            span.set_attribute("batch_size", len(records))
            span.set_attribute("file_name", file_name)
            
            try:
                for i, record in enumerate(records):
                    # Add metadata to each record
                    message = {
                        "source_file": file_name,
                        "record_index": i,
                        "data": record
                    }
                    
                    # Use file name as partition key for better distribution
                    key = f"{file_name}_{i}"
                    
                    future = self.producer.send(self.topic, value=message, key=key)
                
                # Wait for all messages to be sent
                self.producer.flush()
                logger.info(f"Successfully sent batch of {len(records)} records from {file_name}")
                
            except Exception as e:
                span.record_exception(e)
                span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
                logger.error(f"Error sending batch to Kafka: {str(e)}")
                raise
    
    def close(self):
        """Close the Kafka producer"""
        if self.producer:
            self.producer.close()
            logger.info("Kafka producer closed")