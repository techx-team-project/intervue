ALTER TABLE jobs
    ADD COLUMN paused_at TIMESTAMP NULL AFTER retopped_at,
    ADD COLUMN closed_at TIMESTAMP NULL AFTER paused_at;
