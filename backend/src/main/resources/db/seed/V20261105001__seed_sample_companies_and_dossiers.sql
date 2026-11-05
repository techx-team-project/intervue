-- InterVue Local Development Seed Data
-- Companies, Members, Business Documents & Company Agreements
-- Target: TechX Global, FPT Software, VNG Tech

-- 1. Ensure seed users exist and have required roles
INSERT IGNORE INTO users (name, email, password, phone, phone_verified_at, email_verified_at, terms_accepted_at, created_at, updated_at)
VALUES
    ('Local Recruiter', 'local.recruiter@intervue.test', '$2a$10$rleR9jQ8jbRraOBnQSA6suLGMTzM/a4TrdXiw7nPRMEe4e.AKoNRC', '0901000005', NOW(), NOW(), NOW(), NOW(), NOW()),
    ('Local Multi Role', 'local.multirole@intervue.test', '$2a$10$rleR9jQ8jbRraOBnQSA6suLGMTzM/a4TrdXiw7nPRMEe4e.AKoNRC', '0901000006', NOW(), NOW(), NOW(), NOW(), NOW());

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'local.recruiter@intervue.test' AND r.name = 'RECRUITER';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'local.multirole@intervue.test' AND r.name IN ('RECRUITER', 'CANDIDATE');

-- 2. Seed Companies
INSERT INTO companies (name, trading_name, tax_code, business_type, industry, website, market, target_customers, size, email, phone, address, description, benefits, verification_status, verified_at, created_at, updated_at)
VALUES
    (
        'CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX GLOBAL',
        'TechX Global',
        '0318928391',
        'ENTERPRISE',
        'Information Technology',
        'https://techx.intervue.vn',
        'Vietnam & APAC',
        'B2B Enterprise',
        '100-499',
        'contact@techx.intervue.vn',
        '02812345678',
        'Tầng 12, Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội',
        'TechX Global is an elite software engineering company empowering digital transformations across APAC.',
        '13th month salary, premium healthcare, flexible hybrid work model, top-tier equipment.',
        'PENDING_REVIEW',
        NULL,
        NOW() - INTERVAL 5 DAY,
        NOW() - INTERVAL 5 DAY
    ),
    (
        'CÔNG TY CỔ PHẦN TẬP ĐOÀN ĐẦU TƯ FPT SOFTWARE',
        'FPT Software',
        '0101248141',
        'ENTERPRISE',
        'Information Technology',
        'https://fptsoftware.com',
        'Global',
        'Global 500 Enterprises',
        '1000+',
        'recruitment@fpt.com',
        '02473007300',
        'Tòa nhà FPT Cầu Giấy, Phố Duy Tân, Cầu Giấy, Hà Nội',
        'A world-class technology and IT services provider headquartered in Vietnam, delivering software consulting and digital services globally.',
        'Global mobility opportunities, competitive allowances, comprehensive healthcare, campus facilities.',
        'PENDING_REVIEW',
        NULL,
        NOW() - INTERVAL 10 DAY,
        NOW() - INTERVAL 10 DAY
    ),
    (
        'CÔNG TY TNHH PHÁT TRIỂN PHẦN MỀM VNG TECH',
        'VNG Corporation',
        '0108392102',
        'ENTERPRISE',
        'Internet & Gaming',
        'https://vng.com.vn',
        'Southeast Asia',
        'B2C & B2B Digital Users',
        '1000+',
        'contact@vng.com.vn',
        '02839623888',
        'Z06 Đường số 13, Công viên phần mềm Quang Trung, Quận 12, TP. Hồ Chí Minh',
        'Vietnam leading technology unicorn specializing in digital content, online entertainment, financial services, and cloud solutions.',
        'VNG Campus standard workspace, performance-based stock options (ESOP), premium gym and healthcare.',
        'VERIFIED',
        NOW() - INTERVAL 30 DAY,
        NOW() - INTERVAL 60 DAY,
        NOW() - INTERVAL 30 DAY
    )
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Seed Company Members
-- TechX Global (0318928391)
INSERT IGNORE INTO company_members (company_id, user_id, member_role, status, joined_at, created_at, updated_at)
SELECT c.id, u.id, 'OWNER', 'ACTIVE', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY
FROM companies c, users u
WHERE c.tax_code = '0318928391' AND u.email = 'local.multirole@intervue.test';

INSERT IGNORE INTO company_members (company_id, user_id, member_role, status, joined_at, created_at, updated_at)
SELECT c.id, u.id, 'MEMBER', 'ACTIVE', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY
FROM companies c, users u
WHERE c.tax_code = '0318928391' AND u.email = 'local.recruiter@intervue.test';

-- FPT Software (0101248141)
INSERT IGNORE INTO company_members (company_id, user_id, member_role, status, joined_at, created_at, updated_at)
SELECT c.id, u.id, 'MEMBER', 'ACTIVE', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY
FROM companies c, users u
WHERE c.tax_code = '0101248141' AND u.email = 'candidate.recruiter@intervue.test';

-- VNG Tech (0108392102)
INSERT IGNORE INTO company_members (company_id, user_id, member_role, status, joined_at, created_at, updated_at)
SELECT c.id, u.id, 'OWNER', 'ACTIVE', NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 60 DAY
FROM companies c, users u
WHERE c.tax_code = '0108392102' AND u.email = 'candidate.verified@intervue.test';

-- 4. Seed Business Documents
-- Document 1: TechX Global - Letter of Authorization (Approved)
INSERT INTO business_documents (company_id, submitted_by, document_type, review_status, storage_public_id, original_file_name, file_size_bytes, content_type, checksum_sha256, submitted_at, reviewed_at, reviewed_by, review_reason, expires_at, created_at, updated_at)
SELECT 
    c.id, u.id, 'LETTER_OF_AUTHORIZATION', 'APPROVED', 
    'intervue/legal/techx_loa.pdf', 'GiayUyQuyen.pdf', 245760, 'application/pdf',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY, admin.id, NULL, NOW() + INTERVAL 4 YEAR,
    NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY
FROM companies c
JOIN users u ON u.email = 'local.multirole@intervue.test'
LEFT JOIN users admin ON admin.email = 'admin@intervue.test'
WHERE c.tax_code = '0318928391'
AND NOT EXISTS (
    SELECT 1 FROM business_documents bd WHERE bd.company_id = c.id AND bd.original_file_name = 'GiayUyQuyen.pdf'
);

-- Document 2: TechX Global - Business License (Revoked)
INSERT INTO business_documents (company_id, submitted_by, document_type, review_status, storage_public_id, original_file_name, file_size_bytes, content_type, checksum_sha256, submitted_at, reviewed_at, reviewed_by, review_reason, expires_at, created_at, updated_at)
SELECT 
    c.id, u.id, 'BUSINESS_LICENSE', 'REVOKED', 
    'intervue/legal/techx_erc_revoked.pdf', 'GPKD.pdf', 412000, 'application/pdf',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 2 DAY, admin.id, 'MEMBER cannot submit ERC; requires OWNER or valid LOA', NULL,
    NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 2 DAY
FROM companies c
JOIN users u ON u.email = 'local.recruiter@intervue.test'
LEFT JOIN users admin ON admin.email = 'admin@intervue.test'
WHERE c.tax_code = '0318928391'
AND NOT EXISTS (
    SELECT 1 FROM business_documents bd WHERE bd.company_id = c.id AND bd.original_file_name = 'GPKD.pdf'
);

-- Document 3: FPT Software - Letter of Authorization (Pending Review >24h SLA Overdue)
INSERT INTO business_documents (company_id, submitted_by, document_type, review_status, storage_public_id, original_file_name, file_size_bytes, content_type, checksum_sha256, submitted_at, reviewed_at, reviewed_by, review_reason, expires_at, created_at, updated_at)
SELECT 
    c.id, u.id, 'LETTER_OF_AUTHORIZATION', 'PENDING_REVIEW', 
    'intervue/legal/fpt_loa.pdf', 'GiayUyQuyen_FPT_TranThiThuThao.pdf', 315000, 'application/pdf',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    NOW() - INTERVAL 28 HOUR, NULL, NULL, NULL, NULL,
    NOW() - INTERVAL 28 HOUR, NOW() - INTERVAL 28 HOUR
FROM companies c
JOIN users u ON u.email = 'candidate.recruiter@intervue.test'
WHERE c.tax_code = '0101248141'
AND NOT EXISTS (
    SELECT 1 FROM business_documents bd WHERE bd.company_id = c.id AND bd.original_file_name = 'GiayUyQuyen_FPT_TranThiThuThao.pdf'
);

-- Document 4: VNG Tech - Business License (Pending Review, within SLA 18h)
INSERT INTO business_documents (company_id, submitted_by, document_type, review_status, storage_public_id, original_file_name, file_size_bytes, content_type, checksum_sha256, submitted_at, reviewed_at, reviewed_by, review_reason, expires_at, created_at, updated_at)
SELECT 
    c.id, u.id, 'BUSINESS_LICENSE', 'PENDING_REVIEW', 
    'intervue/legal/vng_erc.pdf', 'DangKyKinhDoanh_VNG_Software.pdf', 524000, 'application/pdf',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    NOW() - INTERVAL 18 HOUR, NULL, NULL, NULL, NULL,
    NOW() - INTERVAL 18 HOUR, NOW() - INTERVAL 18 HOUR
FROM companies c
JOIN users u ON u.email = 'candidate.verified@intervue.test'
WHERE c.tax_code = '0108392102'
AND NOT EXISTS (
    SELECT 1 FROM business_documents bd WHERE bd.company_id = c.id AND bd.original_file_name = 'DangKyKinhDoanh_VNG_Software.pdf'
);

-- 5. Seed Company Agreements
-- Standard agreements accepted for TechX Global
INSERT INTO company_agreements (scope, company_id, user_id, signed_by, agreement_type, acceptance_mode, version, status, accepted_at, storage_public_id, created_at, updated_at)
SELECT 
    'COMPANY', c.id, NULL, u.id, 'CANDIDATE_DATA', 'STANDARD_TEMPLATE', 'v1.0', 'ACCEPTED', NOW() - INTERVAL 4 DAY, NULL, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY
FROM companies c, users u
WHERE c.tax_code = '0318928391' AND u.email = 'local.multirole@intervue.test'
AND NOT EXISTS (
    SELECT 1 FROM company_agreements ca WHERE ca.company_id = c.id AND ca.agreement_type = 'CANDIDATE_DATA' AND ca.scope = 'COMPANY'
);

INSERT INTO company_agreements (scope, company_id, user_id, signed_by, agreement_type, acceptance_mode, version, status, accepted_at, storage_public_id, created_at, updated_at)
SELECT 
    'COMPANY', c.id, NULL, u.id, 'PLATFORM_DATA', 'STANDARD_TEMPLATE', 'v1.0', 'ACCEPTED', NOW() - INTERVAL 4 DAY, NULL, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY
FROM companies c, users u
WHERE c.tax_code = '0318928391' AND u.email = 'local.multirole@intervue.test'
AND NOT EXISTS (
    SELECT 1 FROM company_agreements ca WHERE ca.company_id = c.id AND ca.agreement_type = 'PLATFORM_DATA' AND ca.scope = 'COMPANY'
);

-- User-level personal agreements for members of TechX Global
INSERT INTO company_agreements (scope, company_id, user_id, signed_by, agreement_type, acceptance_mode, version, status, accepted_at, storage_public_id, created_at, updated_at)
SELECT 
    'USER', c.id, u.id, u.id, 'CANDIDATE_DATA', 'STANDARD_TEMPLATE', 'v1.0', 'ACCEPTED', NOW() - INTERVAL 4 DAY, NULL, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY
FROM companies c, users u
WHERE c.tax_code = '0318928391' AND u.email = 'local.multirole@intervue.test'
AND NOT EXISTS (
    SELECT 1 FROM company_agreements ca WHERE ca.company_id = c.id AND ca.user_id = u.id AND ca.agreement_type = 'CANDIDATE_DATA' AND ca.scope = 'USER'
);

-- Custom Agreement awaiting Admin review for FPT Software (triggers custom agreement review workflow)
INSERT INTO company_agreements (scope, company_id, user_id, signed_by, agreement_type, acceptance_mode, version, status, accepted_at, storage_public_id, created_at, updated_at)
SELECT 
    'COMPANY', c.id, NULL, u.id, 'CANDIDATE_DATA', 'CUSTOM_UPLOAD', 'fpt-custom-dpa-v1', 'PENDING_REVIEW', NOW() - INTERVAL 20 HOUR, 'intervue/agreements/fpt_custom_dpa.pdf', NOW() - INTERVAL 20 HOUR, NOW() - INTERVAL 20 HOUR
FROM companies c, users u
WHERE c.tax_code = '0101248141' AND u.email = 'candidate.recruiter@intervue.test'
AND NOT EXISTS (
    SELECT 1 FROM company_agreements ca WHERE ca.company_id = c.id AND ca.version = 'fpt-custom-dpa-v1'
);

