ALTER TABLE free_quota_settings
    CHANGE COLUMN job_free_active_limit job_free_post_limit INT UNSIGNED NOT NULL DEFAULT 3;

CREATE TABLE job_free_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    INDEX idx_job_free_posts_company (company_id),
    CONSTRAINT fk_job_free_posts_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
);
