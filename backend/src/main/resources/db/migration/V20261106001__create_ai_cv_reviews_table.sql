CREATE TABLE ai_cv_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    overall_score INT NULL,
    summary TEXT NULL,
    comments_json JSON NOT NULL,
    model_version VARCHAR(100) NOT NULL,
    prompt_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ai_cv_reviews_candidate_hash (candidate_profile_id, file_hash),
    CONSTRAINT fk_ai_cv_reviews_candidate_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE
);

