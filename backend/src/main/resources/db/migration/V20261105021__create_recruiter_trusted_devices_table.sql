-- ============================================================================
-- Migration: V20261105021__create_recruiter_trusted_devices_table.sql
-- Description: Adds trusted device persistence for recruiter 2FA bypass (30 days)
-- ============================================================================

CREATE TABLE IF NOT EXISTS recruiter_trusted_devices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    device_token_hash VARCHAR(64) NOT NULL UNIQUE,
    device_name VARCHAR(120) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    last_used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trusted_device_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiters (id) ON DELETE CASCADE,
    INDEX idx_recruiter_trusted_device_lookup (recruiter_id, expires_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

