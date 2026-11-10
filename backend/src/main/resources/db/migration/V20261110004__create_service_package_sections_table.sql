CREATE TABLE service_package_sections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    package_id BIGINT UNSIGNED NOT NULL,
    heading VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50) NULL,
    accent_color VARCHAR(20) NULL,
    body TEXT NULL,
    image_url VARCHAR(500) NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_service_package_sections_package FOREIGN KEY (package_id) REFERENCES service_packages (id) ON DELETE CASCADE,
    INDEX idx_service_package_sections_package (package_id, display_order)
);
