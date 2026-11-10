ALTER TABLE billing_settings
    ADD COLUMN payment_sync_since TIMESTAMP NULL AFTER payment_sync_enabled;
