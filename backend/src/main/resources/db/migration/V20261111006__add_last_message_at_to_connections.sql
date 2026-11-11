ALTER TABLE connections ADD COLUMN last_message_at DATETIME(6) NULL;
UPDATE connections c SET last_message_at = (SELECT MAX(created_at) FROM connection_messages m WHERE m.connection_id = c.id);
UPDATE connections SET last_message_at = invited_at WHERE last_message_at IS NULL;
ALTER TABLE connections ADD KEY idx_connections_company_last_message (company_id, last_message_at);
ALTER TABLE connections ADD KEY idx_connections_candidate_last_message (candidate_id, last_message_at);

