CREATE TABLE company_photos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_company_photos_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
    INDEX idx_company_photos_company_sort (company_id, sort_order)
);
