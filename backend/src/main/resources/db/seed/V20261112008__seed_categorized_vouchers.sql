INSERT IGNORE INTO vouchers (
    code, label, description, ribbon_label, accent_color, conditions_json,
    discount_type, discount_value, max_discount, min_order_value,
    starts_at, ends_at, usage_limit, used_count, per_company_limit, status,
    created_at, updated_at
) VALUES
(
    'FLEX15',
    'Giảm 15% gói Credit linh hoạt',
    'Ưu đãi tối đa 1.500.000đ khi mua các gói Flex Credit (Flex Basic, Flex Pro).',
    'FLEX CREDIT',
    'EMERALD',
    '["Chỉ áp dụng cho gói Flex Basic và Flex Pro (giá trước VAT)","Đơn hàng từ 6.000.000đ, mức giảm tối đa 1.500.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần trong chương trình"]',
    'PERCENTAGE', 15, 1500000, 6000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 45 DAY),
    400, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'BRAND800K',
    'Giảm ngay 800.000đ nâng cấp Brand Page',
    'Giảm trực tiếp 800.000đ cho gói xây dựng thương hiệu tuyển dụng Brand Page.',
    'BRAND PAGE',
    'EMERALD',
    '["Chỉ áp dụng cho gói Brand Page (giá trước VAT)","Đơn hàng tối thiểu 5.000.000đ","Mỗi doanh nghiệp được áp dụng tối đa 1 lần trong chương trình"]',
    'FIXED', 800000, NULL, 5000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 60 DAY),
    250, 0, 1, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'PROMAX1M',
    'Giảm 1.000.000đ cho gói Pro Max & Plus',
    'Ưu đãi 1.000.000đ khi doanh nghiệp đăng ký gói đăng tin Pro Max hoặc Pro Max Plus.',
    'VIP RECRUIT',
    'AMBER',
    '["Chỉ áp dụng cho gói Pro Max và Pro Max Plus (giá trước VAT)","Đơn hàng tối thiểu 7.500.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần trong chương trình"]',
    'FIXED', 1000000, NULL, 7500000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY),
    200, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'ADDON20',
    'Giảm 20% dịch vụ cộng thêm tin đăng',
    'Giảm 20% (tối đa 400.000đ) cho nhãn GẤP, nhãn HOT, nền nổi bật và đẩy top tin.',
    'ADD-ONS',
    'AMBER',
    '["Áp dụng cho gói Add-on Nhãn GẤP, Nhãn HOT, Tin nổi bật và Đẩy Top","Đơn hàng từ 1.000.000đ, giảm tối đa 400.000đ","Mỗi doanh nghiệp được áp dụng tối đa 3 lần"]',
    'PERCENTAGE', 20, 400000, 1000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 40 DAY),
    500, 0, 3, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'BANNER500K',
    'Giảm 500.000đ đặt vị trí Banner quảng cáo',
    'Áp dụng cho mọi gói đặt Banner Trang chủ và Trang tìm việc theo tuần.',
    'BANNER ADS',
    'ROSE',
    '["Áp dụng cho các gói Banner Trang chủ (Đầu/Giữa trang) và Banner Trang tìm việc","Đơn hàng từ 2.000.000đ trở lên (chưa VAT)","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'FIXED', 500000, NULL, 2000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 25 DAY),
    180, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'ENTERPRISE1M5',
    'Giảm 1.500.000đ cho đơn từ 10.000.000đ',
    'Ưu đãi dành cho đơn hàng tuyển dụng quy mô lớn từ 10.000.000đ trở lên (chưa VAT).',
    'ENTERPRISE',
    'ROSE',
    '["Áp dụng trên giá niêm yết của tất cả gói dịch vụ (chưa VAT)","Tổng giá trị đơn hàng từ 10.000.000đ trở lên","Không áp dụng đồng thời với mã giảm giá khác"]',
    'FIXED', 1500000, NULL, 10000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 21 DAY),
    120, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'AITOOLS20',
    'Giảm 20% gói AI Resume Match & AI JD',
    'Tiết kiệm đến 500.000đ khi mua gói Add-on AI Resume Match hoặc AI JD Generator.',
    'AI RECRUIT',
    'BLUE',
    '["Áp dụng cho gói Add-on AI Resume Match và Add-on AI JD Generator","Đơn hàng từ 1.200.000đ, giảm tối đa 500.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'PERCENTAGE', 20, 500000, 1200000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 45 DAY),
    400, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'TRIAL200K',
    'Giảm 200.000đ trải nghiệm gói Trial',
    'Giảm trực tiếp 200.000đ khi doanh nghiệp đăng ký gói dùng thử Eco Trial hoặc Pro Trial.',
    'TRIAL PACK',
    'BLUE',
    '["Chỉ áp dụng cho gói Eco Trial và Pro Trial (giá trước VAT)","Đơn hàng tối thiểu 890.000đ","Mỗi doanh nghiệp chỉ áp dụng 1 lần duy nhất"]',
    'FIXED', 200000, NULL, 890000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 60 DAY),
    600, 0, 1, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
);

INSERT IGNORE INTO voucher_applicable_packages (voucher_id, package_id)
SELECT v.id, p.id
FROM vouchers v
JOIN service_packages p ON (
    (v.code = 'FLEX15' AND p.code IN ('FLEX_BASIC', 'FLEX_PRO'))
    OR (v.code = 'BRAND800K' AND p.code = 'BRAND_PAGE')
    OR (v.code = 'PROMAX1M' AND p.code IN ('PRO_MAX', 'PRO_MAX_PLUS'))
    OR (v.code = 'ADDON20' AND p.code IN ('ADDON_URGENT', 'ADDON_HOT', 'ADDON_HIGHLIGHT', 'ADDON_RETOP'))
    OR (v.code = 'BANNER500K' AND p.code IN ('BANNER_HOME_TOP', 'BANNER_HOME_MID', 'BANNER_JOBS_SIDE'))
    OR (v.code = 'AITOOLS20' AND p.code IN ('ADDON_AI_MATCH', 'ADDON_AI_JD'))
    OR (v.code = 'TRIAL200K' AND p.code IN ('PRO_TRIAL', 'ECO_TRIAL'))
);
