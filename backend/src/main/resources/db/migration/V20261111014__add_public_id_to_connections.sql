ALTER TABLE connections
  ADD COLUMN public_id VARCHAR(36) NULL AFTER id;

UPDATE connections
SET public_id = LOWER(UUID())
WHERE public_id IS NULL;

ALTER TABLE connections
  MODIFY COLUMN public_id VARCHAR(36) NOT NULL,
  ADD UNIQUE KEY uk_connections_public_id (public_id);
