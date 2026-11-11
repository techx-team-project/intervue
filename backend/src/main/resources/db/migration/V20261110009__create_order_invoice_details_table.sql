CREATE TABLE order_invoice_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    invoice_type VARCHAR(20) NOT NULL,
    tax_id VARCHAR(30) NULL,
    company_name VARCHAR(255) NULL,
    company_address VARCHAR(500) NULL,
    full_name VARCHAR(150) NULL,
    identity_number VARCHAR(30) NULL,
    personal_address VARCHAR(500) NULL,
    recipient_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_order_invoice_details_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    UNIQUE KEY uk_order_invoice_details_order (order_id)
);
