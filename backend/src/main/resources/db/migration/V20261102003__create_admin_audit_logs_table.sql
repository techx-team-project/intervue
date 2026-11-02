CREATE TABLE admin_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_type VARCHAR(20) NOT NULL,
    actor_id BIGINT UNSIGNED NULL,
    actor_email VARCHAR(100) NULL,
    action VARCHAR(64) NOT NULL,
    target_type VARCHAR(32) NOT NULL,
    target_id BIGINT UNSIGNED NULL,
    reason VARCHAR(255) NULL,
    detail TEXT NULL,
    ip VARCHAR(45) NULL,
    trace_id VARCHAR(36) NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_admin_audit_logs_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_admin_audit_logs_target (target_type, target_id, created_at),
    INDEX idx_admin_audit_logs_actor (actor_id, created_at),
    INDEX idx_admin_audit_logs_action (action, created_at)
);
