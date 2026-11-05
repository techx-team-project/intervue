ALTER TABLE candidate_profiles
    ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'VND' AFTER salary_max,
    ADD COLUMN salary_period VARCHAR(20) NOT NULL DEFAULT 'MONTHLY' AFTER currency,
    ADD COLUMN total_yoe DECIMAL(3,1) NULL DEFAULT 0.0 AFTER desired_level;

