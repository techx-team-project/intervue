CREATE TABLE candidate_resumes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_public_id VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    parsed_summary TEXT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_resumes_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_resumes_profile (candidate_profile_id)
);

