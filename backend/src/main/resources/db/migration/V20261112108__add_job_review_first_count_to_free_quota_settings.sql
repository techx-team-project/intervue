ALTER TABLE free_quota_settings
    ADD COLUMN job_review_first_count INT UNSIGNED NOT NULL DEFAULT 3 AFTER job_free_max_days;
