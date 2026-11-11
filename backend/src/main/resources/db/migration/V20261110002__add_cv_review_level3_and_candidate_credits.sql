-- 1. Candidate Credit Balances Table
CREATE TABLE candidate_credit_balances (
    candidate_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    balance INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidate_credit_balances_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE
);

-- 2. Candidate Credit Transactions Table (Audit Ledger)
CREATE TABLE candidate_credit_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    amount INT NOT NULL,
    balance_after INT NOT NULL,
    type VARCHAR(30) NOT NULL,
    feature VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100) NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cct_candidate_created (candidate_id, created_at),
    CONSTRAINT fk_cct_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE
);

-- 3. Extend ai_cv_reviews Table for Level 3 (Job Fit)
ALTER TABLE ai_cv_reviews
    ADD COLUMN job_id BIGINT UNSIGNED NULL AFTER candidate_profile_id,
    ADD COLUMN review_level INT NOT NULL DEFAULT 1 AFTER job_id,
    ADD COLUMN target_position VARCHAR(150) NULL AFTER review_level,
    ADD COLUMN job_fit_score INT NULL AFTER overall_score,
    ADD COLUMN requirement_matches_json JSON NULL AFTER comments_json,
    ADD COLUMN charged_credits INT NOT NULL DEFAULT 0 AFTER prompt_version,
    ADD COLUMN is_refunded BOOLEAN NOT NULL DEFAULT FALSE AFTER charged_credits,
    ADD CONSTRAINT fk_ai_cv_reviews_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE SET NULL,
    ADD INDEX idx_ai_cv_reviews_level_job (candidate_profile_id, file_hash, job_id, review_level);

