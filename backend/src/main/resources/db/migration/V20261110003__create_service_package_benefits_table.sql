CREATE TABLE service_package_benefits (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    package_id BIGINT UNSIGNED NOT NULL,
    entitlement_type VARCHAR(40) NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    duration_days INT UNSIGNED NULL,
    label VARCHAR(255) NOT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_service_package_benefits_package FOREIGN KEY (package_id) REFERENCES service_packages (id) ON DELETE CASCADE,
    INDEX idx_service_package_benefits_package (package_id, display_order)
);
