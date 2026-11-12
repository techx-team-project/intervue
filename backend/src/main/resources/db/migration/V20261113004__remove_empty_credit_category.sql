-- The CREDIT category only ever held the two packages deleted in the previous
-- migration; with Credit retired it has zero packages left, so remove it too.
DELETE FROM service_categories WHERE code = 'CREDIT';
