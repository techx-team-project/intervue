-- ============================================================================
-- Migration: V20261108002__seed_sample_job_alerts.sql
-- Description: Seed sample job alerts for development and testing
-- ============================================================================

INSERT INTO job_alerts (id, user_id, title, keyword, city, career_level, work_mode, salary_min, currency, frequency, is_active, unsubscribe_token, last_sent_at, created_at, updated_at)
SELECT 1, u.id, 'Senior React & Next.js Engineer in Ho Chi Minh City', 'React', 'Ho Chi Minh City', 'Senior', 'HYBRID', 35000000, 'VND', 'DAILY', 1, 'token-react-senior-hcm-001', NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 5 DAY, NOW()
FROM users u WHERE u.email = 'local.candidate@intervue.test'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO job_alerts (id, user_id, title, keyword, city, career_level, work_mode, salary_min, currency, frequency, is_active, unsubscribe_token, last_sent_at, created_at, updated_at)
SELECT 2, u.id, 'Java & Spring Boot Backend in Hanoi', 'Java', 'Hanoi', 'Mid', 'ONSITE', 25000000, 'VND', 'DAILY', 1, 'token-java-backend-hn-002', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 10 DAY, NOW()
FROM users u WHERE u.email = 'local.candidate@intervue.test'
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed initial deliveries for demonstration
INSERT INTO job_alert_deliveries (alert_id, job_id, sent_at)
SELECT 1, '5', NOW() - INTERVAL 4 HOUR
FROM job_alerts WHERE id = 1
ON DUPLICATE KEY UPDATE sent_at = VALUES(sent_at);

INSERT INTO job_alert_deliveries (alert_id, job_id, sent_at)
SELECT 2, '301', NOW() - INTERVAL 1 DAY
FROM job_alerts WHERE id = 2
ON DUPLICATE KEY UPDATE sent_at = VALUES(sent_at);

