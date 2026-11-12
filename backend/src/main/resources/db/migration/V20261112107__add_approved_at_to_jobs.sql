ALTER TABLE jobs
    ADD COLUMN approved_at TIMESTAMP NULL AFTER closed_at;

UPDATE jobs SET approved_at = published_at WHERE published_at IS NOT NULL;

CREATE INDEX idx_jobs_company_approved ON jobs (company_id, approved_at);
