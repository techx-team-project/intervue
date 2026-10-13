INSERT INTO roles (name, description, is_system) VALUES
    ('CANDIDATE', 'Job seeker', 1),
    ('RECRUITER', 'Hiring on behalf of a company', 1),
    ('ADMIN', 'Platform operator', 1)
AS new_role
ON DUPLICATE KEY UPDATE description = new_role.description, is_system = new_role.is_system;
