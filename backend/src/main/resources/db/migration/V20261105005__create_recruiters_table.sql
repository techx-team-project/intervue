CREATE TABLE recruiters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    phone VARCHAR(20) NULL,
    image VARCHAR(255) NULL,
    email_verified_at TIMESTAMP NULL,
    terms_accepted_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_recruiters_email UNIQUE (email),
    CONSTRAINT uk_recruiters_phone UNIQUE (phone),
    INDEX idx_recruiters_status_created_at (status, created_at)
);
