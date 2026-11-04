ALTER TABLE refresh_tokens
    ADD COLUMN origin VARCHAR(16) NOT NULL DEFAULT 'SIGN_IN';

UPDATE refresh_tokens
SET origin = 'ROTATION'
WHERE id IN (
    SELECT replaced_by_token_id
    FROM (SELECT replaced_by_token_id FROM refresh_tokens WHERE replaced_by_token_id IS NOT NULL) AS t
);

CREATE INDEX idx_refresh_tokens_user_origin ON refresh_tokens (user_id, origin);

