-- Add back side of citizen identity card (CCCD) to business documents for full 2-sided LOA verification
ALTER TABLE business_documents
ADD COLUMN identity_back_storage_public_id VARCHAR(255) NULL AFTER identity_storage_public_id,
ADD COLUMN identity_back_file_name VARCHAR(255) NULL AFTER identity_file_name;

