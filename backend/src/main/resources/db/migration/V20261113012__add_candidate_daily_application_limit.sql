ALTER TABLE free_quota_settings
    ADD COLUMN candidate_daily_application_limit INT UNSIGNED NOT NULL DEFAULT 10 AFTER job_review_first_count;
