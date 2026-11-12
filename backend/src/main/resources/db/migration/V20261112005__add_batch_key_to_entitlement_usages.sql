ALTER TABLE entitlement_usages
    ADD COLUMN batch_key VARCHAR(64) NULL AFTER note,
    ADD INDEX idx_entitlement_usages_company_type (company_id, entitlement_type, started_at);

