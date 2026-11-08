CREATE TABLE saved_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_saved_jobs_candidate FOREIGN KEY (candidate_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_jobs_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
    UNIQUE KEY uq_saved_jobs_candidate_job (candidate_id, job_id),
    INDEX idx_saved_jobs_candidate_created (candidate_id, created_at)
);

CREATE TABLE company_follows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_company_follows_candidate FOREIGN KEY (candidate_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_company_follows_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
    UNIQUE KEY uq_company_follows_candidate_company (candidate_id, company_id),
    INDEX idx_company_follows_company (company_id),
    INDEX idx_company_follows_candidate_created (candidate_id, created_at)
);
