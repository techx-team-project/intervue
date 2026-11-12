ALTER TABLE free_quota_settings
    ADD COLUMN job_free_active_limit INT UNSIGNED NOT NULL DEFAULT 3 AFTER require_job_slot,
    ADD COLUMN job_free_max_days INT UNSIGNED NOT NULL DEFAULT 60 AFTER job_free_active_limit;
