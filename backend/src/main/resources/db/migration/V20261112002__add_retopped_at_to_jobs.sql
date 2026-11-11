ALTER TABLE jobs
    ADD COLUMN retopped_at TIMESTAMP NULL AFTER published_at;

CREATE INDEX idx_jobs_public_ranking ON jobs (status, boost_level, retopped_at, published_at);
