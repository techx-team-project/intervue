ALTER TABLE users
    ADD COLUMN delete_requested_at TIMESTAMP NULL AFTER last_login_at,
    ADD COLUMN deleted_at TIMESTAMP NULL AFTER delete_requested_at;

CREATE INDEX idx_users_status_delete_requested ON users (status, delete_requested_at);

