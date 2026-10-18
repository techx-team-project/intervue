-- Local/test only (db/seed, not applied outside the local profile); plaintext is "Recruiter@123"
UPDATE users
SET password = '$2a$10$0QhyOhldpfdNhPRFft6.ne722FXUM./2QWK7pxha2v.7UD2NtyYRu'
WHERE email = 'candidate.recruiter@intervue.test';
