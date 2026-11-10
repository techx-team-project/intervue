CREATE TABLE ad_metrics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ad_booking_id BIGINT UNSIGNED NOT NULL,
    metric_date DATE NOT NULL,
    impressions INT UNSIGNED NOT NULL DEFAULT 0,
    clicks INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_ad_metrics_booking FOREIGN KEY (ad_booking_id) REFERENCES ad_bookings (id) ON DELETE CASCADE,
    CONSTRAINT uq_ad_metrics_booking_date UNIQUE (ad_booking_id, metric_date)
);
