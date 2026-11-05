-- ============================================================================
-- Migration: V20261105020__create_recruiter_two_factor_tables.sql
-- Description: Adds TOTP two-factor authentication support for recruiters
-- ============================================================================

CREATE TABLE IF NOT EXISTS recruiter_two_factor (
    recruiter_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    method ENUM('TOTP', 'EMAIL') NOT NULL DEFAULT 'TOTP',
    secret VARCHAR(255) NOT NULL,
    confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_recruiter_two_factor_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiters (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS recruiter_two_factor_recovery_codes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    code_hash VARCHAR(64) NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recruiter_recovery_codes_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiters (id) ON DELETE CASCADE,
    INDEX idx_recruiter_recovery_codes_recruiter (recruiter_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

