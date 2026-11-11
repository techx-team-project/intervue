CREATE TABLE ai_mock_interviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    resume_id BIGINT UNSIGNED NULL,
    target_role VARCHAR(150) NOT NULL,
    seniority_level VARCHAR(50) NOT NULL,
    focus_area VARCHAR(50) NOT NULL,
    question_count INT NOT NULL DEFAULT 5,
    current_question_index INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
    overall_score INT NULL,
    overall_feedback TEXT NULL,
    strengths_json TEXT NULL,
    improvements_json TEXT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    INDEX idx_mock_interviews_candidate (candidate_id, created_at)
);

CREATE TABLE ai_mock_interview_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mock_interview_id BIGINT UNSIGNED NOT NULL,
    question_order INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    candidate_answer TEXT NULL,
    answered_at TIMESTAMP NULL,
    follow_up_question TEXT NULL,
    follow_up_answer TEXT NULL,
    follow_up_answered_at TIMESTAMP NULL,
    feedback TEXT NULL,
    score INT NULL,
    ideal_answer TEXT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_mock_interview_questions_interview FOREIGN KEY (mock_interview_id) REFERENCES ai_mock_interviews (id) ON DELETE CASCADE,
    INDEX idx_mock_questions_interview (mock_interview_id, question_order)
);

