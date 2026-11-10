CREATE TABLE ad_bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ad_slot_id BIGINT UNSIGNED NOT NULL,
    week_start DATE NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    order_item_id BIGINT UNSIGNED NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RESERVED',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_ad_bookings_slot FOREIGN KEY (ad_slot_id) REFERENCES ad_slots (id),
    CONSTRAINT fk_ad_bookings_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL,
    CONSTRAINT uq_ad_bookings_slot_week UNIQUE (ad_slot_id, week_start),
    INDEX idx_ad_bookings_week (week_start, status),
    INDEX idx_ad_bookings_company (company_id, status)
);
