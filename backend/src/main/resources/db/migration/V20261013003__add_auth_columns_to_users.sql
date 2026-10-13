ALTER TABLE users
    MODIFY COLUMN phone VARCHAR(20) NULL,
    ADD COLUMN email_verified_at TIMESTAMP NULL AFTER password,
    ADD COLUMN terms_accepted_at TIMESTAMP NULL AFTER email_verified_at;

UPDATE users SET email = LOWER(email);
