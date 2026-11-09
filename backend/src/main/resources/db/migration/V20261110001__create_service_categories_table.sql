CREATE TABLE service_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    description VARCHAR(500) NULL,
    need_key VARCHAR(50) NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE KEY uk_service_categories_code (code),
    INDEX idx_service_categories_active_order (is_active, display_order)
);
