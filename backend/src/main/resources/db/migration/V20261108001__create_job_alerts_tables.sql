-- ============================================================================
-- Migration: V20261108001__create_job_alerts_tables.sql
-- Description: Store candidate job alerts and delivery history for deduplication
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_alerts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(150) NOT NULL,
    keyword VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    career_level VARCHAR(30) NULL,
    work_mode VARCHAR(30) NULL,
    salary_min BIGINT UNSIGNED NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    frequency VARCHAR(20) NOT NULL DEFAULT 'DAILY',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    unsubscribe_token VARCHAR(64) NOT NULL UNIQUE,
    last_sent_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_alerts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job_alerts_dispatch (is_active, frequency, last_sent_at),
    INDEX idx_job_alerts_user (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_alert_deliveries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    alert_id BIGINT UNSIGNED NOT NULL,
    job_id VARCHAR(64) NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_alert_deliveries_alert FOREIGN KEY (alert_id) REFERENCES job_alerts(id) ON DELETE CASCADE,
    CONSTRAINT uq_alert_job_delivery UNIQUE (alert_id, job_id),
    INDEX idx_job_alert_deliveries_alert (alert_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

