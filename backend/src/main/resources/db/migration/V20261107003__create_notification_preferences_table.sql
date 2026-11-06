-- ============================================================================
-- Migration: V20261107003__create_notification_preferences_table.sql
-- Description: Per-recipient opt-out for non mandatory notification categories
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipient_type VARCHAR(16) NOT NULL,
    recipient_id BIGINT UNSIGNED NOT NULL,
    category VARCHAR(32) NOT NULL,
    in_app BOOLEAN NOT NULL DEFAULT TRUE,
    email BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_notification_preferences UNIQUE (recipient_type, recipient_id, category),
    INDEX idx_notification_preferences_recipient (recipient_type, recipient_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
