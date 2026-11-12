INSERT INTO credit_prices (entitlement_type, tier, credit_cost, duration_days, label, is_active, display_order, created_at, updated_at)
SELECT 'AI_JD_GENERATE', 1, 15, NULL, '01 lượt AI soạn thảo mô tả công việc (JD)', 1, 13, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM credit_prices WHERE entitlement_type = 'AI_JD_GENERATE' AND tier = 1
);

INSERT INTO service_packages (
    category_id, code, slug, name, short_description,
    price, currency, badge, vip_ribbon, accent_color,
    validity_days, bonus_credits, one_time_per_company, status, display_order,
    created_at, updated_at
)
SELECT
    (SELECT id FROM service_categories WHERE code = 'ADD_ON' LIMIT 1),
    'ADDON_AI_JD', 'addon-ai-jd', 'ADD-ON AI JD GENERATOR',
    'Bổ sung 100 lượt AI tự động soạn thảo mô tả, yêu cầu ứng viên và quyền lợi công việc chuyên nghiệp.',
    2000, 'VND', 'NEW', 0, '#2563eb',
    NULL, 0, 0, 'ACTIVE', 6,
    NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM service_categories WHERE code = 'ADD_ON')
  AND NOT EXISTS (SELECT 1 FROM service_packages WHERE code = 'ADDON_AI_JD');

INSERT INTO service_package_benefits (package_id, entitlement_type, quantity, tier, duration_days, label, display_order, created_at, updated_at)
SELECT
    p.id, 'AI_JD_GENERATE', 100, 1, NULL, '100 lượt AI soạn thảo mô tả công việc (JD)', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_AI_JD'
  AND NOT EXISTS (
      SELECT 1 FROM service_package_benefits b WHERE b.package_id = p.id
  );

UPDATE service_packages
SET short_description = 'Nâng cấp trang doanh nghiệp với album lên tới 10 ảnh văn hoá, huy hiệu Brand Page và ưu tiên xuất hiện trong mục Công ty nổi bật.',
    updated_at = NOW()
WHERE code = 'BRAND_PAGE';

UPDATE service_package_benefits b
    JOIN service_packages p ON p.id = b.package_id
SET b.label = 'Trang doanh nghiệp nâng cấp (tối đa 10 ảnh & huy hiệu) trong 30 ngày',
    b.updated_at = NOW()
WHERE p.code = 'BRAND_PAGE' AND b.entitlement_type = 'BRAND_PAGE';

UPDATE credit_prices
SET label = 'Trang doanh nghiệp nâng cấp (tối đa 10 ảnh & huy hiệu) trong 30 ngày',
    updated_at = NOW()
WHERE entitlement_type = 'BRAND_PAGE' AND tier = 1;
