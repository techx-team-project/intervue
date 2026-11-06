CREATE TABLE job_screening_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    position TINYINT UNSIGNED NOT NULL,
    question_type VARCHAR(20) NOT NULL,
    prompt VARCHAR(300) NOT NULL,
    required BOOLEAN NOT NULL DEFAULT FALSE,
    options JSON NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_job_screening_questions_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
    INDEX idx_job_screening_questions_job_position (job_id, position)
);
