CREATE TABLE candidate_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    headline VARCHAR(120) NULL,
    bio TEXT NULL,
    contact_email VARCHAR(255) NULL,
    gender VARCHAR(10) NULL,
    birth_year SMALLINT NULL,
    show_personal_details BOOLEAN NOT NULL DEFAULT FALSE,
    searchable_by_recruiters BOOLEAN NOT NULL DEFAULT TRUE,
    job_search_status VARCHAR(20) NOT NULL DEFAULT 'OPEN_TO_OFFERS',
    github_url VARCHAR(255) NULL,
    linkedin_url VARCHAR(255) NULL,
    portfolio_url VARCHAR(255) NULL,
    avatar_public_id VARCHAR(255) NULL,
    cover_public_id VARCHAR(255) NULL,
    desired_role VARCHAR(120) NULL,
    desired_level VARCHAR(20) NULL,
    salary_min BIGINT UNSIGNED NULL,
    salary_max BIGINT UNSIGNED NULL,
    salary_negotiable BOOLEAN NOT NULL DEFAULT FALSE,
    work_mode VARCHAR(20) NULL,
    contract_type VARCHAR(20) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uq_candidate_profiles_user_id UNIQUE (user_id),
    CONSTRAINT fk_candidate_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE candidate_preferred_locations (
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    city VARCHAR(100) NOT NULL,
    PRIMARY KEY (candidate_profile_id, city),
    CONSTRAINT fk_candidate_preferred_locations_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE
);

CREATE TABLE candidate_preferred_industries (
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    industry VARCHAR(100) NOT NULL,
    PRIMARY KEY (candidate_profile_id, industry),
    CONSTRAINT fk_candidate_preferred_industries_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE
);
