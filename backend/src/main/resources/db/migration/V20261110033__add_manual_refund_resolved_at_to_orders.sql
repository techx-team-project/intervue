ALTER TABLE orders
    ADD COLUMN manual_refund_resolved_at TIMESTAMP NULL AFTER cancelled_at;
