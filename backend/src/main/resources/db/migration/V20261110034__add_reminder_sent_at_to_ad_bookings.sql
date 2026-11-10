ALTER TABLE ad_bookings
    ADD COLUMN reminder_sent_at TIMESTAMP NULL AFTER consumed_at;
