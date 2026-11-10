ALTER TABLE companies
    ADD COLUMN featured_until TIMESTAMP NULL,
    ADD COLUMN brand_page_until TIMESTAMP NULL;

CREATE INDEX idx_companies_featured_until ON companies (featured_until);
