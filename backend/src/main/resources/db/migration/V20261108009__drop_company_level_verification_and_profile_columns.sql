ALTER TABLE companies
    DROP INDEX idx_companies_verification_status,
    DROP COLUMN trading_name,
    DROP COLUMN business_type,
    DROP COLUMN industry,
    DROP COLUMN website,
    DROP COLUMN market,
    DROP COLUMN target_customers,
    DROP COLUMN size,
    DROP COLUMN email,
    DROP COLUMN phone,
    DROP COLUMN description,
    DROP COLUMN benefits,
    DROP COLUMN logo_public_id,
    DROP COLUMN verification_status,
    DROP COLUMN verified_at;

ALTER TABLE company_members DROP COLUMN member_role;
