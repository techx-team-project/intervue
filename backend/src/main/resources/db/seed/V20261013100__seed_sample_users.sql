INSERT INTO users (name, email, password, phone, email_verified_at, terms_accepted_at) VALUES
    ('Nguyen Van An', 'candidate.verified@intervue.test', '$2a$10$rleR9jQ8jbRraOBnQSA6suLGMTzM/a4TrdXiw7nPRMEe4e.AKoNRC', '0901000001', NOW(), NOW()),
    ('Tran Thi Binh', 'candidate.unverified@intervue.test', '$2a$10$rleR9jQ8jbRraOBnQSA6suLGMTzM/a4TrdXiw7nPRMEe4e.AKoNRC', NULL, NULL, NOW()),
    ('Le Van Cuong', 'candidate.recruiter@intervue.test', '$2a$10$rleR9jQ8jbRraOBnQSA6suLGMTzM/a4TrdXiw7nPRMEe4e.AKoNRC', '0901000003', NOW(), NOW()),
    ('Pham Thi Dung', 'admin@intervue.test', '$2a$10$rleR9jQ8jbRraOBnQSA6suLGMTzM/a4TrdXiw7nPRMEe4e.AKoNRC', '0901000004', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'CANDIDATE'
WHERE u.email IN (
    'candidate.verified@intervue.test',
    'candidate.unverified@intervue.test',
    'candidate.recruiter@intervue.test'
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'RECRUITER'
WHERE u.email = 'candidate.recruiter@intervue.test';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'ADMIN'
WHERE u.email = 'admin@intervue.test';
