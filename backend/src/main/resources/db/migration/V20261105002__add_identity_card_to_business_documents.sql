-- Add identity card / citizen ID (CCCD) support to business documents for LOA verifications
ALTER TABLE business_documents
ADD COLUMN identity_storage_public_id VARCHAR(255) NULL AFTER storage_public_id,
ADD COLUMN identity_file_name VARCHAR(255) NULL AFTER original_file_name;

