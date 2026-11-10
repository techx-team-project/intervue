CREATE TABLE credit_prices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    entitlement_type VARCHAR(40) NOT NULL,
    tier INT UNSIGNED NOT NULL DEFAULT 1,
    credit_cost INT UNSIGNED NOT NULL,
    duration_days INT UNSIGNED NULL,
    label VARCHAR(255) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uq_credit_prices_type_tier UNIQUE (entitlement_type, tier),
    INDEX idx_credit_prices_active_order (is_active, display_order)
);

INSERT INTO credit_prices (entitlement_type, tier, credit_cost, duration_days, label, is_active, display_order, created_at, updated_at) VALUES
('JOB_POST_SLOT', 1, 900, 30, '01 tin tuyển dụng trong 30 ngày', 1, 1, NOW(), NOW()),
('JOB_BOOST', 1, 450, 30, 'Vị trí hiển thị ưu tiên trong 30 ngày', 1, 2, NOW(), NOW()),
('JOB_BOOST', 2, 700, 30, 'Vị trí hiển thị cao trong 30 ngày', 1, 3, NOW(), NOW()),
('JOB_BOOST', 3, 1000, 30, 'Vị trí hiển thị cao nhất trong 30 ngày', 1, 4, NOW(), NOW()),
('JOB_LABEL_URGENT', 1, 1000, 7, 'Nhãn GẤP trong 07 ngày', 1, 5, NOW(), NOW()),
('JOB_LABEL_HOT', 1, 1000, 7, 'Nhãn HOT trong 07 ngày', 1, 6, NOW(), NOW()),
('JOB_HIGHLIGHT', 1, 1200, 7, 'Nền tin nổi bật trong 07 ngày', 1, 7, NOW(), NOW()),
('JOB_RETOP', 1, 220, NULL, '01 lượt đẩy tin lên đầu danh sách', 1, 8, NOW(), NOW()),
('JOB_ALERT_PUSH', 1, 400, NULL, '01 lượt đẩy tin vào thông báo việc làm', 1, 9, NOW(), NOW()),
('AI_RESUME_MATCH', 1, 4, NULL, '01 lượt AI đối chiếu CV với yêu cầu tin', 1, 10, NOW(), NOW()),
('BRAND_PAGE', 1, 3000, 30, 'Trang doanh nghiệp nâng cấp trong 30 ngày', 1, 11, NOW(), NOW()),
('FEATURED_COMPANY', 1, 2000, 30, 'Ưu tiên trong mục Công ty nổi bật 30 ngày', 1, 12, NOW(), NOW());
