CREATE TABLE ad_creatives (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ad_booking_id BIGINT UNSIGNED NOT NULL,
    image_public_id VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rejection_reason VARCHAR(500) NULL,
    reviewed_by_user_id BIGINT UNSIGNED NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_ad_creatives_booking FOREIGN KEY (ad_booking_id) REFERENCES ad_bookings (id) ON DELETE CASCADE,
    CONSTRAINT uq_ad_creatives_booking UNIQUE (ad_booking_id),
    INDEX idx_ad_creatives_status (status, created_at)
);
