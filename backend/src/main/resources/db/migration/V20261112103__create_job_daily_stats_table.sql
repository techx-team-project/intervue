CREATE TABLE job_daily_stats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    stat_date DATE NOT NULL,
    views INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_job_daily_stats_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
    CONSTRAINT uq_job_daily_stats_job_date UNIQUE (job_id, stat_date)
);
