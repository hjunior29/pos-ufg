import os
import sys
import logging
import glob
from pathlib import Path

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from config.config import Config
from src.tracing import setup_tracing
from src.csv_processor import CSVProcessor
from src.kafka_producer import KafkaDataProducer

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    # Setup tracing
    tracer = setup_tracing(Config.SERVICE_NAME, Config.JAEGER_ENDPOINT)
    
    with tracer.start_as_current_span("load_app_main") as span:
        try:
            logger.info("Starting Load App")
            span.set_attribute("service.name", Config.SERVICE_NAME)
            
            # Initialize components
            csv_processor = CSVProcessor(Config.BATCH_SIZE)
            kafka_producer = KafkaDataProducer(Config.KAFKA_BOOTSTRAP_SERVERS, Config.KAFKA_TOPIC)
            
            # Find CSV files in data directory
            csv_files = glob.glob(os.path.join(Config.CSV_DATA_PATH, "*.csv"))
            
            if not csv_files:
                logger.warning(f"No CSV files found in {Config.CSV_DATA_PATH}")
                return
            
            span.set_attribute("csv_files_count", len(csv_files))
            logger.info(f"Found {len(csv_files)} CSV files to process")
            
            # Process each CSV file
            total_records = 0
            for csv_file in csv_files:
                file_name = Path(csv_file).name
                logger.info(f"Processing file: {file_name}")
                
                with tracer.start_as_current_span("process_file") as file_span:
                    file_span.set_attribute("file_name", file_name)
                    
                    try:
                        file_records = 0
                        for batch in csv_processor.process_csv_file(csv_file):
                            kafka_producer.send_batch(batch, file_name)
                            file_records += len(batch)
                            total_records += len(batch)
                        
                        file_span.set_attribute("records_processed", file_records)
                        logger.info(f"Completed processing {file_name}: {file_records} records")
                        
                    except Exception as e:
                        file_span.record_exception(e)
                        logger.error(f"Error processing file {file_name}: {str(e)}")
                        continue
            
            span.set_attribute("total_records_processed", total_records)
            logger.info(f"Load App completed. Total records processed: {total_records}")
            
        except Exception as e:
            span.record_exception(e)
            logger.error(f"Error in Load App: {str(e)}")
            raise
        finally:
            if 'kafka_producer' in locals():
                kafka_producer.close()

if __name__ == "__main__":
    main()