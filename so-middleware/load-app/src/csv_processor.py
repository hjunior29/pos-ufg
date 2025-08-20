import pandas as pd
import json
import logging
from typing import Dict, List, Iterator
from opentelemetry import trace

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)

class CSVProcessor:
    def __init__(self, batch_size: int = 1000):
        self.batch_size = batch_size
    
    def process_csv_file(self, file_path: str) -> Iterator[List[Dict]]:
        """Process CSV file in batches and yield JSON-serializable data"""
        with tracer.start_as_current_span("process_csv_file") as span:
            span.set_attribute("file_path", file_path)
            span.set_attribute("batch_size", self.batch_size)
            
            try:
                logger.info(f"Processing CSV file: {file_path}")
                
                # Read CSV in chunks to handle large files
                chunk_iter = pd.read_csv(file_path, chunksize=self.batch_size, 
                                       encoding='utf-8', low_memory=False)
                
                batch_count = 0
                for chunk in chunk_iter:
                    with tracer.start_as_current_span("process_batch") as batch_span:
                        batch_span.set_attribute("batch_number", batch_count)
                        batch_span.set_attribute("batch_size", len(chunk))
                        
                        # Clean and prepare data
                        chunk = chunk.fillna('')  # Replace NaN with empty strings
                        
                        # Convert DataFrame to list of dictionaries
                        records = chunk.to_dict('records')
                        
                        # Ensure all values are JSON serializable
                        json_records = []
                        for record in records:
                            json_record = {}
                            for key, value in record.items():
                                if pd.isna(value):
                                    json_record[key] = None
                                elif isinstance(value, (int, float, str, bool)):
                                    json_record[key] = value
                                else:
                                    json_record[key] = str(value)
                            json_records.append(json_record)
                        
                        batch_count += 1
                        logger.info(f"Processed batch {batch_count} with {len(json_records)} records")
                        
                        yield json_records
                        
            except Exception as e:
                span.record_exception(e)
                span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
                logger.error(f"Error processing CSV file {file_path}: {str(e)}")
                raise