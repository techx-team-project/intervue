CREATE TABLE billing_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vat_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.1000,
    order_expire_hours INT UNSIGNED NOT NULL DEFAULT 72,
    order_code_prefix VARCHAR(10) NOT NULL DEFAULT 'IVO',
    max_pending_orders INT UNSIGNED NOT NULL DEFAULT 3,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO billing_settings (vat_rate, order_expire_hours, order_code_prefix, max_pending_orders, created_at, updated_at)
VALUES (0.1000, 72, 'IVO', 3, NOW(), NOW());
