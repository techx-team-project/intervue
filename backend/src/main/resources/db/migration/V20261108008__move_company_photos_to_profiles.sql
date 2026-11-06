ALTER TABLE company_photos ADD COLUMN company_profile_id BIGINT UNSIGNED NULL AFTER id;

UPDATE company_photos p
JOIN company_members m ON m.company_id = p.company_id AND m.member_role = 'OWNER'
JOIN company_profiles cp ON cp.company_member_id = m.id
SET p.company_profile_id = cp.id;

DELETE FROM company_photos WHERE company_profile_id IS NULL;

ALTER TABLE company_photos DROP FOREIGN KEY fk_company_photos_company;
ALTER TABLE company_photos DROP INDEX idx_company_photos_company_sort;
ALTER TABLE company_photos DROP COLUMN company_id;
ALTER TABLE company_photos MODIFY company_profile_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE company_photos
    ADD CONSTRAINT fk_company_photos_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id) ON DELETE CASCADE,
    ADD INDEX idx_company_photos_profile_sort (company_profile_id, sort_order);
