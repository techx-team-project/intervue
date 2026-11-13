ALTER TABLE refund_requests
    ADD COLUMN bank_code VARCHAR(30) NULL AFTER refundable_amount,
    ADD COLUMN bank_account_number VARCHAR(30) NULL AFTER bank_code,
    ADD COLUMN bank_account_name VARCHAR(150) NULL AFTER bank_account_number;
