CREATE TABLE applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    candidate_id BIGINT UNSIGNED NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    draft_resume_id BIGINT UNSIGNED NULL,
    cv_storage_public_id VARCHAR(255) NULL,
    cv_file_name VARCHAR(255) NULL,
    cv_content_type VARCHAR(100) NULL,
    cv_file_size_bytes BIGINT UNSIGNED NULL,
    cover_letter TEXT NULL,
    submitted_at TIMESTAMP NULL,
    viewed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs (id),
    CONSTRAINT fk_applications_candidate FOREIGN KEY (candidate_id) REFERENCES users (id),
    CONSTRAINT uq_applications_job_candidate UNIQUE (job_id, candidate_id),
    INDEX idx_applications_candidate_status (candidate_id, status, updated_at),
    INDEX idx_applications_job_status (job_id, status),
    INDEX idx_applications_company_status (company_id, status)
);

CREATE TABLE application_answers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    question_prompt VARCHAR(300) NOT NULL,
    answer_text VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_application_answers_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    CONSTRAINT uq_application_answers_question UNIQUE (application_id, question_id)
);

CREATE TABLE application_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL,
    from_status VARCHAR(20) NULL,
    to_status VARCHAR(20) NOT NULL,
    actor_type VARCHAR(20) NOT NULL,
    actor_id BIGINT UNSIGNED NULL,
    note VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_application_history_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    INDEX idx_application_history_application (application_id, created_at)
);
