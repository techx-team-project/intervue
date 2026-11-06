-- ============================================================================
-- Migration: V20261107001__create_notifications_table.sql
-- Description: Stores notification content shared by every recipient of it
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kind VARCHAR(16) NOT NULL,
    type VARCHAR(64) NOT NULL,
    audience VARCHAR(16) NULL,
    category VARCHAR(32) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    body_markdown TEXT NULL,
    action_url VARCHAR(500) NULL,
    action_label VARCHAR(100) NULL,
    status VARCHAR(16) NULL,
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    created_by_admin_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_notifications_broadcast_queue (kind, status, scheduled_at),
    INDEX idx_notifications_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
