ALTER TABLE jobs
    ADD COLUMN boost_level INT UNSIGNED NOT NULL DEFAULT 0 AFTER status,
    ADD COLUMN boost_expires_at TIMESTAMP NULL AFTER boost_level,
    ADD COLUMN highlight_label VARCHAR(20) NULL AFTER boost_expires_at,
    ADD COLUMN highlight_label_expires_at TIMESTAMP NULL AFTER highlight_label,
    ADD COLUMN highlighted TINYINT(1) NOT NULL DEFAULT 0 AFTER highlight_label_expires_at,
    ADD COLUMN highlight_expires_at TIMESTAMP NULL AFTER highlighted;

CREATE INDEX idx_jobs_boost_ranking ON jobs (status, boost_level, published_at);
