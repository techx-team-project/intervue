DELETE FROM user_roles
WHERE role_id IN (SELECT id FROM roles WHERE name = 'RECRUITER');

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'CANDIDATE'
WHERE NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id);

DELETE FROM roles WHERE name = 'RECRUITER';
