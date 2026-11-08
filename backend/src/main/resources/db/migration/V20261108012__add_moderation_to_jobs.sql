ALTER TABLE jobs
    ADD COLUMN hidden_reason VARCHAR(500) NULL AFTER published_at,
    ADD COLUMN hidden_at TIMESTAMP NULL AFTER hidden_reason,
    ADD COLUMN hidden_by BIGINT UNSIGNED NULL AFTER hidden_at;
