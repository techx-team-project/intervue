ALTER TABLE recruiters
    ADD COLUMN delete_requested_at TIMESTAMP NULL AFTER last_login_at;

CREATE INDEX idx_recruiters_status_delete_requested_at ON recruiters (status, delete_requested_at);
