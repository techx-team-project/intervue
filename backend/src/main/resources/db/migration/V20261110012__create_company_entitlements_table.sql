CREATE TABLE company_entitlements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    source_order_item_id BIGINT UNSIGNED NULL,
    purchased_by_recruiter_id BIGINT UNSIGNED NULL,
    entitlement_type VARCHAR(40) NOT NULL,
    label VARCHAR(255) NOT NULL,
    total_quantity INT UNSIGNED NOT NULL,
    remaining_quantity INT UNSIGNED NOT NULL,
    duration_days INT UNSIGNED NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    activation_deadline TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_company_entitlements_company FOREIGN KEY (company_id) REFERENCES companies (id),
    CONSTRAINT fk_company_entitlements_order_item FOREIGN KEY (source_order_item_id) REFERENCES order_items (id) ON DELETE SET NULL,
    INDEX idx_company_entitlements_lookup (company_id, entitlement_type, status),
    INDEX idx_company_entitlements_deadline (status, activation_deadline)
);
