DROP TABLE candidate_preferred_locations;

DROP TABLE candidate_preferred_industries;

CREATE TABLE candidate_preferred_locations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_preferred_locations_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_preferred_locations_profile (candidate_profile_id)
);

CREATE TABLE candidate_preferred_industries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_profile_id BIGINT UNSIGNED NOT NULL,
    industry VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_preferred_industries_profile FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    INDEX idx_candidate_preferred_industries_profile (candidate_profile_id)
);
