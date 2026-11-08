ALTER TABLE applications
    ADD COLUMN candidate_name VARCHAR(150) NOT NULL DEFAULT '' AFTER company_id,
    ADD COLUMN candidate_email VARCHAR(255) NOT NULL DEFAULT '' AFTER candidate_name,
    ADD INDEX idx_applications_company_updated (company_id, status, updated_at);

UPDATE applications a
JOIN users u ON u.id = a.candidate_id
SET a.candidate_name = u.name, a.candidate_email = u.email;

CREATE TABLE application_notes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    content VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_application_notes_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    INDEX idx_application_notes_application (application_id, created_at)
);
