import json
import logging
from kafka import KafkaConsumer
from typing import Dict, List, Callable
from threading import Event
from opentelemetry import trace

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)

class KafkaDataConsumer:
    def __init__(self, bootstrap_servers: str, topic: str, group_id: str, 
                 batch_size: int = 1000, flush_interval: int = 30):
        self.topic = topic
        self.batch_size = batch_size
        self.flush_interval = flush_interval
        self.stop_event = Event()
        
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            key_deserializer=lambda k: k.decode('utf-8') if k else None,
            enable_auto_commit=False,
            auto_offset_reset='earliest',
            consumer_timeout_ms=flush_interval * 1000
        )
        
        logger.info(f"Kafka consumer initialized for topic: {topic}, group: {group_id}")
    
    def consume_and_process(self, process_batch_callback: Callable[[List[Dict], str], None]):
        """Consume messages and process them in batches"""
        with tracer.start_as_current_span("consume_messages") as span:
            span.set_attribute("topic", self.topic)
            span.set_attribute("batch_size", self.batch_size)
            
            current_batch = []
            current_source_file = None
            
            try:
                logger.info("Starting message consumption...")
                
                while not self.stop_event.is_set():
                    message_batch = self.consumer.poll(timeout_ms=1000)
                    
                    if not message_batch:
                        # Timeout reached, flush current batch if exists
                        if current_batch:
                            self._flush_batch(current_batch, current_source_file, process_batch_callback)
                            current_batch = []
                            current_source_file = None
                        continue
                    
                    for topic_partition, messages in message_batch.items():
                        with tracer.start_as_current_span("process_message_batch") as batch_span:
                            batch_span.set_attribute("partition", topic_partition.partition)
                            batch_span.set_attribute("message_count", len(messages))
                            
                            for message in messages:
                                try:
                                    data = message.value
                                    source_file = data.get('source_file')
                                    record = data.get('data')
                                    
                                    if not record:
                                        logger.warning("Received message without data")
                                        continue
                                    
                                    # If source file changes, flush current batch
                                    if current_source_file and current_source_file != source_file:
                                        if current_batch:
                                            self._flush_batch(current_batch, current_source_file, process_batch_callback)
                                            current_batch = []
                                    
                                    current_source_file = source_file
                                    current_batch.append(record)
                                    
                                    # Flush batch if it reaches batch size
                                    if len(current_batch) >= self.batch_size:
                                        self._flush_batch(current_batch, current_source_file, process_batch_callback)
                                        current_batch = []
                                        current_source_file = None
                                
                                except Exception as e:
                                    batch_span.record_exception(e)
                                    logger.error(f"Error processing message: {str(e)}")
                                    continue
                    
                    # Commit offsets after processing
                    self.consumer.commit()
                
                # Final flush when stopping
                if current_batch:
                    self._flush_batch(current_batch, current_source_file, process_batch_callback)
                    
            except Exception as e:
                span.record_exception(e)
                span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
                logger.error(f"Error in message consumption: {str(e)}")
                raise
    
    def _flush_batch(self, batch: List[Dict], source_file: str, 
                    process_batch_callback: Callable[[List[Dict], str], None]):
        """Flush current batch using the provided callback"""
        with tracer.start_as_current_span("flush_batch") as span:
            span.set_attribute("batch_size", len(batch))
            span.set_attribute("source_file", source_file)
            
            try:
                logger.info(f"Flushing batch of {len(batch)} records from {source_file}")
                process_batch_callback(batch, source_file)
                
            except Exception as e:
                span.record_exception(e)
                span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
                logger.error(f"Error flushing batch: {str(e)}")
                raise
    
    def stop(self):
        """Stop the consumer"""
        logger.info("Stopping Kafka consumer...")
        self.stop_event.set()
    
    def close(self):
        """Close the Kafka consumer"""
        if self.consumer:
            self.consumer.close()
            logger.info("Kafka consumer closed")