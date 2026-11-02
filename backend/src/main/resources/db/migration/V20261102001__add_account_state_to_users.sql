ALTER TABLE users
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' AFTER password,
    ADD COLUMN last_login_at TIMESTAMP NULL AFTER terms_accepted_at;

CREATE INDEX idx_users_status_created_at ON users (status, created_at);

CREATE INDEX idx_users_last_login_at ON users (last_login_at);
