-- ============================================================================
-- Migration: V20261107002__create_notification_recipients_table.sql
-- Description: Per-recipient delivery state so one notification can fan out to
--              many accounts without sharing its read state
-- ============================================================================

-- recipient_id points at either users.id or recruiters.id depending on
-- recipient_type, so it carries no foreign key.
CREATE TABLE IF NOT EXISTS notification_recipients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    notification_id BIGINT UNSIGNED NOT NULL,
    recipient_type VARCHAR(16) NOT NULL,
    recipient_id BIGINT UNSIGNED NOT NULL,
    read_at TIMESTAMP NULL,
    seen_at TIMESTAMP NULL,
    archived_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_recipients_notification FOREIGN KEY (notification_id) REFERENCES notifications (id) ON DELETE CASCADE,
    CONSTRAINT uq_notification_recipients UNIQUE (notification_id, recipient_type, recipient_id),
    INDEX idx_notification_recipients_inbox (recipient_type, recipient_id, archived_at, created_at),
    INDEX idx_notification_recipients_unread (recipient_type, recipient_id, read_at),
    INDEX idx_notification_recipients_retention (read_at, archived_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
