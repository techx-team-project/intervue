ALTER TABLE connections
  ADD COLUMN candidate_last_read_message_id BIGINT UNSIGNED NULL,
  ADD COLUMN candidate_last_read_at DATETIME(6) NULL,
  ADD COLUMN recruiter_last_read_message_id BIGINT UNSIGNED NULL,
  ADD COLUMN recruiter_last_read_at DATETIME(6) NULL;

ALTER TABLE connection_messages
  ADD COLUMN client_message_id VARCHAR(64) NULL,
  ADD COLUMN reply_to_message_id BIGINT UNSIGNED NULL,
  ADD COLUMN edited_at DATETIME(6) NULL,
  ADD COLUMN recalled_at DATETIME(6) NULL,
  ADD COLUMN recalled_by_type VARCHAR(20) NULL,
  ADD COLUMN recalled_by_id BIGINT UNSIGNED NULL,
  ADD UNIQUE KEY uq_connection_messages_client_id (connection_id, sender_type, sender_id, client_message_id),
  ADD KEY idx_connection_messages_reply_to (reply_to_message_id),
  ADD CONSTRAINT fk_connection_messages_reply_to
    FOREIGN KEY (reply_to_message_id) REFERENCES connection_messages (id) ON DELETE SET NULL;

CREATE TABLE connection_message_reactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id BIGINT UNSIGNED NOT NULL,
  actor_type VARCHAR(20) NOT NULL,
  actor_id BIGINT UNSIGNED NOT NULL,
  emoji VARCHAR(16) NOT NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  UNIQUE KEY uq_connect_msg_reaction_actor (message_id, actor_type, actor_id),
  KEY idx_connect_msg_reaction_msg (message_id),
  CONSTRAINT fk_connect_msg_reaction_message
    FOREIGN KEY (message_id) REFERENCES connection_messages (id) ON DELETE CASCADE
);

CREATE TABLE connection_message_hides (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id BIGINT UNSIGNED NOT NULL,
  actor_type VARCHAR(20) NOT NULL,
  actor_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  UNIQUE KEY uq_connect_msg_hide_actor (message_id, actor_type, actor_id),
  KEY idx_connect_msg_hide_actor (actor_type, actor_id, message_id),
  CONSTRAINT fk_connect_msg_hide_message
    FOREIGN KEY (message_id) REFERENCES connection_messages (id) ON DELETE CASCADE
);

