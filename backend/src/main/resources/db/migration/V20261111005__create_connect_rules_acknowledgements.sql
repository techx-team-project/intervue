CREATE TABLE connect_rules_acknowledgements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_type VARCHAR(20) NOT NULL,
  actor_id BIGINT UNSIGNED NOT NULL,
  acknowledged_at DATETIME(6) NOT NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  UNIQUE KEY uq_connect_rules_ack_actor (actor_type, actor_id)
);
