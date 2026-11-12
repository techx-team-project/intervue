ALTER TABLE company_entitlements
    MODIFY COLUMN activation_deadline TIMESTAMP NULL,
    ADD COLUMN is_bonus TINYINT(1) NOT NULL DEFAULT 0 AFTER duration_days;

