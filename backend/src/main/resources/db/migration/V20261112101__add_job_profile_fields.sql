ALTER TABLE jobs
    ADD COLUMN job_role VARCHAR(20) NULL AFTER level,
    ADD COLUMN experience_min_years INT UNSIGNED NULL AFTER job_role,
    ADD COLUMN experience_max_years INT UNSIGNED NULL AFTER experience_min_years,
    ADD COLUMN salary_basis VARCHAR(10) NULL AFTER salary_currency,
    ADD COLUMN benefit_tags JSON NOT NULL DEFAULT (JSON_ARRAY()),
    ADD COLUMN hiring_steps JSON NOT NULL DEFAULT (JSON_ARRAY()),
    ADD INDEX idx_jobs_role_status (job_role, status);

UPDATE jobs
SET job_role = CASE
    WHEN title LIKE '%full stack%' OR title LIKE '%fullstack%' OR title LIKE '%full-stack%' THEN 'FULLSTACK'
    WHEN title LIKE '%devops%' OR title REGEXP '\\bsre\\b' OR title LIKE '%cloud%' OR title LIKE '%infrastructure%' THEN 'DEVOPS'
    WHEN title LIKE '%android%' OR title REGEXP '\\bios\\b' OR title LIKE '%flutter%' OR title LIKE '%react native%' OR title LIKE '%mobile%' THEN 'MOBILE'
    WHEN title REGEXP '\\bux\\b' OR title LIKE '%designer%' THEN 'UIUX'
    WHEN title LIKE '%security%' OR title LIKE '%pentest%' OR title LIKE '%cyber%' THEN 'SECURITY'
    WHEN title REGEXP '\\bqa\\b' OR title LIKE '%tester%' OR title LIKE '%quality%' OR title LIKE '%test engineer%' THEN 'QA'
    WHEN title LIKE '%data%' OR title LIKE '%machine learning%' OR title LIKE '%ai engineer%' OR title LIKE '%ml engineer%' THEN 'DATA_AI'
    WHEN title LIKE '%business analyst%' THEN 'BA'
    WHEN title LIKE '%project manager%' OR title LIKE '%product manager%' OR title LIKE '%scrum%' THEN 'PM'
    WHEN title LIKE '%front%' OR title LIKE '%react%' OR title LIKE '%vue%' OR title LIKE '%angular%' THEN 'FRONTEND'
    WHEN title LIKE '%back%' OR title LIKE '%java%' OR title LIKE '%spring%' OR title LIKE '%.net%' OR title LIKE '%node%' OR title LIKE '%golang%' OR title LIKE '%php%' OR title LIKE '%python%' THEN 'BACKEND'
    ELSE 'OTHER'
END;

UPDATE jobs SET salary_basis = 'GROSS' WHERE salary_negotiable = 0 AND salary_min IS NOT NULL;

UPDATE jobs
SET experience_min_years = CASE level
        WHEN 'INTERN' THEN 0
        WHEN 'JUNIOR' THEN 0
        WHEN 'MID' THEN 2
        WHEN 'SENIOR' THEN 4
        WHEN 'LEAD' THEN 6
    END,
    experience_max_years = CASE level
        WHEN 'INTERN' THEN 1
        WHEN 'JUNIOR' THEN 2
        WHEN 'MID' THEN 4
        WHEN 'SENIOR' THEN 8
        WHEN 'LEAD' THEN 12
    END
WHERE level IS NOT NULL;
