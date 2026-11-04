CREATE TABLE candidate_experiences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(120) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NULL,
    achievements TEXT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_experiences_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_experiences_profile (candidate_profile_id)
);

CREATE TABLE candidate_experience_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_experience_id BIGINT UNSIGNED NOT NULL,
    skill VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_experience_skills_experience FOREIGN KEY (candidate_experience_id) REFERENCES candidate_experiences (id) ON DELETE CASCADE,
    INDEX idx_candidate_experience_skills_experience (candidate_experience_id)
);

CREATE TABLE candidate_educations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    school VARCHAR(150) NOT NULL,
    degree VARCHAR(100) NULL,
    major VARCHAR(150) NULL,
    start_year SMALLINT NOT NULL,
    end_year SMALLINT NULL,
    gpa VARCHAR(20) NULL,
    achievements TEXT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_educations_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_educations_profile (candidate_profile_id)
);

CREATE TABLE candidate_projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NULL,
    highlights TEXT NULL,
    github_url VARCHAR(255) NULL,
    demo_url VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_projects_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_projects_profile (candidate_profile_id)
);

CREATE TABLE candidate_project_technologies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_project_id BIGINT UNSIGNED NOT NULL,
    technology VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_project_technologies_project FOREIGN KEY (candidate_project_id) REFERENCES candidate_projects (id) ON DELETE CASCADE,
    INDEX idx_candidate_project_technologies_project (candidate_project_id)
);

CREATE TABLE candidate_certifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    issuer VARCHAR(150) NOT NULL,
    issue_date DATE NULL,
    credential_id VARCHAR(100) NULL,
    credential_url VARCHAR(255) NULL,
    image_public_id VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_certifications_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_certifications_profile (candidate_profile_id)
);

CREATE TABLE candidate_languages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    language VARCHAR(60) NOT NULL,
    proficiency VARCHAR(20) NOT NULL,
    certificate VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_languages_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_languages_profile (candidate_profile_id)
);

CREATE TABLE candidate_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(60) NOT NULL,
    category VARCHAR(20) NOT NULL,
    level VARCHAR(20) NOT NULL,
    years TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_skills_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_skills_profile (candidate_profile_id)
);
