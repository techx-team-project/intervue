CREATE TABLE entitlement_usages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    entitlement_id BIGINT UNSIGNED NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    entitlement_type VARCHAR(40) NOT NULL,
    job_id BIGINT UNSIGNED NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    activated_by_recruiter_id BIGINT UNSIGNED NULL,
    started_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_entitlement_usages_entitlement FOREIGN KEY (entitlement_id) REFERENCES company_entitlements (id),
    CONSTRAINT fk_entitlement_usages_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE SET NULL,
    INDEX idx_entitlement_usages_company (company_id, status),
    INDEX idx_entitlement_usages_job (job_id),
    INDEX idx_entitlement_usages_expiry (status, ends_at)
);
