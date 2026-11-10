CREATE TABLE refund_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    requested_by_recruiter_id BIGINT UNSIGNED NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    refundable_amount BIGINT UNSIGNED NOT NULL,
    approved_amount BIGINT UNSIGNED NULL,
    admin_note VARCHAR(500) NULL,
    reviewed_by_user_id BIGINT UNSIGNED NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_refund_requests_order FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT uq_refund_requests_order UNIQUE (order_id),
    INDEX idx_refund_requests_status_created (status, created_at)
);
