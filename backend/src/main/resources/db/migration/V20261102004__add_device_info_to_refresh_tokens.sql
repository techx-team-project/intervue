ALTER TABLE refresh_tokens
    ADD COLUMN user_agent VARCHAR(255) NULL AFTER replaced_by_token_id,
    ADD COLUMN ip VARCHAR(45) NULL AFTER user_agent,
    ADD COLUMN device_label VARCHAR(100) NULL AFTER ip,
    ADD COLUMN location VARCHAR(100) NULL AFTER device_label,
    ADD COLUMN last_used_at TIMESTAMP NULL AFTER location,
    ADD COLUMN revoked_at TIMESTAMP NULL AFTER last_used_at,
    ADD COLUMN revoked_reason VARCHAR(32) NULL AFTER revoked_at,
    ADD INDEX idx_refresh_tokens_user_active (user_id, revoked, expiry_date);

