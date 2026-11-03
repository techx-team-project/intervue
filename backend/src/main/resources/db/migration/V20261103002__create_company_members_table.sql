CREATE TABLE company_members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    member_role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL,
    revoked_by BIGINT UNSIGNED NULL,
    revoke_reason VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_company_members_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
    CONSTRAINT fk_company_members_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_company_members_revoked_by FOREIGN KEY (revoked_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT uq_company_members_company_user UNIQUE (company_id, user_id),
    INDEX idx_company_members_user_status (user_id, status),
    INDEX idx_company_members_company_status (company_id, status)
);
