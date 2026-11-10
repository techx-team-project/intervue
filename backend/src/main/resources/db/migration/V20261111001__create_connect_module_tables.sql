CREATE TABLE connections (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id BIGINT UNSIGNED NOT NULL,
  candidate_name VARCHAR(150) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  company_id BIGINT UNSIGNED NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  initiated_by_recruiter_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(20) NOT NULL,
  blocked_by_actor_type VARCHAR(20) NULL,
  blocked_by_actor_id BIGINT UNSIGNED NULL,
  blocked_at DATETIME(6) NULL,
  invited_at DATETIME(6) NOT NULL,
  responded_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  UNIQUE KEY uk_connections_candidate_company (candidate_id, company_id),
  KEY idx_connections_company_status (company_id, status),
  KEY idx_connections_candidate_status (candidate_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE connection_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  connection_id BIGINT UNSIGNED NOT NULL,
  sender_type VARCHAR(20) NOT NULL,
  sender_id BIGINT UNSIGNED NOT NULL,
  message_type VARCHAR(20) NOT NULL,
  body TEXT NULL,
  attachment_public_id VARCHAR(255) NULL,
  attachment_url VARCHAR(500) NULL,
  attachment_file_name VARCHAR(255) NULL,
  attachment_content_type VARCHAR(100) NULL,
  attachment_file_size_bytes BIGINT UNSIGNED NULL,
  link_url VARCHAR(500) NULL,
  link_title VARCHAR(255) NULL,
  link_description VARCHAR(500) NULL,
  link_image_url VARCHAR(500) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  CONSTRAINT fk_connection_messages_connection FOREIGN KEY (connection_id)
    REFERENCES connections (id),
  KEY idx_connection_messages_connection_created (connection_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reporter_type VARCHAR(20) NOT NULL,
  reporter_id BIGINT UNSIGNED NOT NULL,
  target_type VARCHAR(30) NOT NULL,
  target_id BIGINT UNSIGNED NOT NULL,
  reason_code VARCHAR(30) NOT NULL,
  reason_note VARCHAR(1000) NULL,
  status VARCHAR(20) NOT NULL,
  admin_note VARCHAR(1000) NULL,
  reviewed_by_user_id BIGINT UNSIGNED NULL,
  reviewed_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  KEY idx_reports_target (target_type, target_id),
  KEY idx_reports_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE connect_filter_words (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pattern VARCHAR(255) NOT NULL,
  is_regex TINYINT(1) NOT NULL DEFAULT 0,
  severity VARCHAR(10) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  note VARCHAR(255) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE connect_violations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_type VARCHAR(20) NOT NULL,
  actor_id BIGINT UNSIGNED NOT NULL,
  connection_id BIGINT UNSIGNED NOT NULL,
  matched_pattern VARCHAR(255) NOT NULL,
  severity VARCHAR(10) NOT NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  CONSTRAINT fk_connect_violations_connection FOREIGN KEY (connection_id)
    REFERENCES connections (id),
  KEY idx_connect_violations_actor_created (actor_type, actor_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE connect_mutes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_type VARCHAR(20) NOT NULL,
  actor_id BIGINT UNSIGNED NOT NULL,
  reason VARCHAR(255) NOT NULL,
  strike_count_at_time INT UNSIGNED NOT NULL,
  starts_at DATETIME(6) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  lifted_at DATETIME(6) NULL,
  lifted_by BIGINT UNSIGNED NULL,
  lifted_reason VARCHAR(255) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  KEY idx_connect_mutes_actor (actor_type, actor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
