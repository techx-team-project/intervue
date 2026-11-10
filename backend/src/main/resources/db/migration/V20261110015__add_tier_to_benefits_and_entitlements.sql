ALTER TABLE service_package_benefits
    ADD COLUMN tier INT UNSIGNED NOT NULL DEFAULT 1 AFTER quantity;

ALTER TABLE company_entitlements
    ADD COLUMN tier INT UNSIGNED NOT NULL DEFAULT 1 AFTER duration_days;

UPDATE service_package_benefits benefit
    JOIN service_packages package ON package.id = benefit.package_id
    SET benefit.tier = 3
    WHERE benefit.entitlement_type = 'JOB_BOOST' AND package.code = 'PRO_MAX_PLUS';

UPDATE service_package_benefits benefit
    JOIN service_packages package ON package.id = benefit.package_id
    SET benefit.tier = 2
    WHERE benefit.entitlement_type = 'JOB_BOOST' AND package.code IN ('PRO_MAX', 'PRO_TRIAL');

UPDATE service_package_benefits benefit
    JOIN service_packages package ON package.id = benefit.package_id
    SET benefit.tier = 1
    WHERE benefit.entitlement_type = 'JOB_BOOST' AND package.code IN ('ECO_PLUS', 'STANDARD_COMBO');
