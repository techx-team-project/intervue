ALTER TABLE cart_items
    ADD COLUMN meta_json TEXT NULL AFTER quantity;

ALTER TABLE order_items
    ADD COLUMN meta_json TEXT NULL AFTER benefits_json;
