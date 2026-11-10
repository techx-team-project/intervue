ALTER TABLE ad_bookings
    ADD COLUMN consumed_at TIMESTAMP NULL AFTER status;
