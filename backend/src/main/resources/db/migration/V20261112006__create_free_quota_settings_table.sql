CREATE TABLE free_quota_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ai_resume_match_free_per_month INT UNSIGNED NOT NULL DEFAULT 30,
    ai_jd_generate_free_per_month INT UNSIGNED NOT NULL DEFAULT 10,
    cv_review_free_per_day INT UNSIGNED NOT NULL DEFAULT 3,
    candidate_starter_credits INT UNSIGNED NOT NULL DEFAULT 5,
    connect_daily_invite_limit INT UNSIGNED NOT NULL DEFAULT 100,
    company_free_photo_limit INT UNSIGNED NOT NULL DEFAULT 3,
    require_job_slot TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO free_quota_settings (
    ai_resume_match_free_per_month,
    ai_jd_generate_free_per_month,
    cv_review_free_per_day,
    candidate_starter_credits,
    connect_daily_invite_limit,
    company_free_photo_limit,
    require_job_slot,
    created_at,
    updated_at
) VALUES (30, 10, 3, 5, 100, 3, 0, NOW(), NOW());

