CREATE TABLE company_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_member_id BIGINT UNSIGNED NOT NULL,
    trading_name VARCHAR(255) NULL,
    business_type VARCHAR(20) NULL,
    industry VARCHAR(150) NULL,
    website VARCHAR(255) NULL,
    market VARCHAR(150) NULL,
    target_customers VARCHAR(150) NULL,
    size VARCHAR(30) NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(500) NULL,
    description TEXT NULL,
    benefits TEXT NULL,
    logo_public_id VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_company_profiles_member FOREIGN KEY (company_member_id) REFERENCES company_members (id) ON DELETE CASCADE,
    CONSTRAINT uq_company_profiles_member UNIQUE (company_member_id)
);

INSERT INTO company_profiles (
    company_member_id, trading_name, business_type, industry, website, market, target_customers,
    size, email, phone, address, description, benefits, logo_public_id, created_at, updated_at)
SELECT
    m.id, c.trading_name, c.business_type, c.industry, c.website, c.market, c.target_customers,
    c.size, c.email, c.phone, c.address, c.description, c.benefits,
    CASE WHEN m.member_role = 'OWNER' THEN c.logo_public_id ELSE NULL END,
    NOW(), NOW()
FROM company_members m
JOIN companies c ON c.id = m.company_id;
