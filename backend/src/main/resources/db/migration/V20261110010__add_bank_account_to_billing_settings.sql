ALTER TABLE billing_settings
    ADD COLUMN bank_code VARCHAR(30) NULL AFTER max_pending_orders,
    ADD COLUMN bank_account_number VARCHAR(30) NULL AFTER bank_code,
    ADD COLUMN bank_account_name VARCHAR(150) NULL AFTER bank_account_number,
    ADD COLUMN payment_sync_enabled TINYINT(1) NOT NULL DEFAULT 0 AFTER bank_account_name;
