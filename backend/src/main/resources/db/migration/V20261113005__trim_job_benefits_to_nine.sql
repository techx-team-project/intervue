-- Product decision: retire JOB_BOOST (ranking tier), JOB_LABEL_URGENT (nhãn GẤP) and
-- JOB_RETOP (đẩy top) entirely, trimming the sellable benefit catalog from 12 to 9 types.
-- JOB_ALERT_PUSH (push into candidate Job Alert email/notifications) is kept; it is a
-- distinct feature from JOB_BOOST, not the "Top 5/10" ranking mechanic.

-- Child rows first (NO ACTION FK to company_entitlements.id).
DELETE FROM entitlement_usages WHERE entitlement_type IN ('JOB_BOOST', 'JOB_LABEL_URGENT', 'JOB_RETOP');
DELETE FROM company_entitlements WHERE entitlement_type IN ('JOB_BOOST', 'JOB_LABEL_URGENT', 'JOB_RETOP');
DELETE FROM service_package_benefits WHERE entitlement_type IN ('JOB_BOOST', 'JOB_LABEL_URGENT', 'JOB_RETOP');

-- Standalone sections whose entire content described the retired mechanic.
DELETE FROM service_package_sections WHERE id IN (46, 51, 54, 55, 58);

-- top-boost-plus section 3 kept the HOT label, drop only the now-false ranking-priority claim.
UPDATE service_package_sections
   SET heading = 'Nhãn HOT nổi bật trên trang Việc làm IT',
       body = '- Kết hợp nhãn **HOT** trong 7 ngày đầu để tăng tỷ lệ nhấp và nộp CV.\n- Phù hợp cho chiến dịch tuyển lập trình viên cần tốc độ.'
 WHERE id = 3;

-- Drop any cart line still pointing at the two packages before deleting them.
DELETE ci FROM cart_items ci
  JOIN service_packages sp ON sp.id = ci.package_id
 WHERE sp.slug IN ('addon-urgent', 'addon-retop');

-- addon-urgent / addon-retop now have nothing left to sell.
DELETE FROM service_packages WHERE slug IN ('addon-urgent', 'addon-retop');

-- tier (1-3) only ever had meaning for JOB_BOOST; every remaining type is always 1.
ALTER TABLE service_package_benefits DROP COLUMN tier;
ALTER TABLE company_entitlements DROP COLUMN tier;

ALTER TABLE jobs
    DROP COLUMN boost_level,
    DROP COLUMN boost_expires_at,
    DROP COLUMN retopped_at;
