-- Credit feature retired by team decision: delete the two credit-only packages
-- (cascades their benefit/section rows) and the CREDIT bonus benefit on every
-- other package that still carries one.
DELETE FROM service_packages WHERE slug IN ('flex-basic', 'flex-pro');
DELETE FROM service_package_benefits WHERE entitlement_type = 'CREDIT';

-- Clear any company credit balance/usage so no row is left with a
-- soon-to-be-removed EntitlementType value.
DELETE FROM entitlement_usages WHERE entitlement_type = 'CREDIT';
DELETE FROM company_entitlements WHERE entitlement_type = 'CREDIT';

-- Audit rows referencing the removed AuditAction/AuditTargetType values.
DELETE FROM admin_audit_logs
 WHERE action IN ('COMPANY_CREDITS_ADJUSTED', 'CREDIT_PRICE_CREATED', 'CREDIT_PRICE_UPDATED')
    OR target_type = 'CREDIT_PRICE';

DROP TABLE credit_prices;

ALTER TABLE service_packages DROP COLUMN bonus_credits;
ALTER TABLE order_items DROP COLUMN bonus_credits;
