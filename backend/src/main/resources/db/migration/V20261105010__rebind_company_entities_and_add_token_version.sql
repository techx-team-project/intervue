-- 1. Ensure any legacy user who is recorded in company tables has a corresponding recruiter account
INSERT IGNORE INTO recruiters (name, email, password, status, phone, created_at, updated_at)
SELECT u.name, u.email, u.password, u.status, u.phone, u.created_at, u.updated_at
FROM users u
WHERE u.id IN (
    SELECT user_id FROM company_members
    UNION
    SELECT signed_by FROM company_agreements
    UNION
    SELECT submitted_by FROM business_documents
);

-- 2. Update existing foreign key references to point to recruiters.id matching email
UPDATE company_members cm
JOIN users u ON u.id = cm.user_id
JOIN recruiters r ON r.email = u.email
SET cm.user_id = r.id;

UPDATE company_agreements ca
JOIN users u ON u.id = ca.signed_by
JOIN recruiters r ON r.email = u.email
SET ca.signed_by = r.id;

UPDATE company_agreements ca
JOIN users u ON u.id = ca.user_id
JOIN recruiters r ON r.email = u.email
SET ca.user_id = r.id;

UPDATE business_documents bd
JOIN users u ON u.id = bd.submitted_by
JOIN recruiters r ON r.email = u.email
SET bd.submitted_by = r.id;

-- 3. Re-bind foreign keys to recruiters table
ALTER TABLE company_members DROP FOREIGN KEY fk_company_members_user;
ALTER TABLE company_members ADD CONSTRAINT fk_company_members_recruiter FOREIGN KEY (user_id) REFERENCES recruiters (id) ON DELETE CASCADE;

ALTER TABLE company_agreements DROP FOREIGN KEY fk_company_agreements_user;
ALTER TABLE company_agreements DROP FOREIGN KEY fk_company_agreements_signed_by;
ALTER TABLE company_agreements ADD CONSTRAINT fk_company_agreements_recruiter FOREIGN KEY (user_id) REFERENCES recruiters (id) ON DELETE CASCADE;
ALTER TABLE company_agreements ADD CONSTRAINT fk_company_agreements_signed_by FOREIGN KEY (signed_by) REFERENCES recruiters (id) ON DELETE CASCADE;

ALTER TABLE business_documents DROP FOREIGN KEY fk_business_documents_submitted_by;
ALTER TABLE business_documents ADD CONSTRAINT fk_business_documents_submitted_by FOREIGN KEY (submitted_by) REFERENCES recruiters (id) ON DELETE CASCADE;

-- 4. Add token_version for instant 0-second token revocation
ALTER TABLE users ADD COLUMN token_version INT UNSIGNED NOT NULL DEFAULT 1 AFTER status;
ALTER TABLE recruiters ADD COLUMN token_version INT UNSIGNED NOT NULL DEFAULT 1 AFTER status;

