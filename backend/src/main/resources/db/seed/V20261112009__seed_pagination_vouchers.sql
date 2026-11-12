INSERT IGNORE INTO vouchers (
    code, label, description, ribbon_label, accent_color, conditions_json,
    discount_type, discount_value, max_discount, min_order_value,
    starts_at, ends_at, usage_limit, used_count, per_company_limit, status,
    created_at, updated_at
) VALUES
(
    'GROWTH18',
    'Giảm 18% đơn hàng tăng trưởng tuyển dụng',
    'Ưu đãi tối đa 3.000.000đ cho mọi gói dịch vụ có giá trị từ 5.000.000đ trở lên.',
    'ALL PACKAGES',
    'EMERALD',
    '["Áp dụng trên giá niêm yết của tất cả gói dịch vụ (chưa VAT)","Đơn hàng tối thiểu 5.000.000đ, giảm tối đa 3.000.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'PERCENTAGE', 18, 3000000, 5000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 35 DAY),
    350, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'TOPJOB1M',
    'Giảm 1.000.000đ gói đăng tin Top Jobs',
    'Áp dụng khi doanh nghiệp đăng ký gói Eco Plus, Pro Max hoặc Pro Max Plus.',
    'TOP JOBS',
    'EMERALD',
    '["Áp dụng cho nhóm gói Eco Plus, Pro Max và Pro Max Plus","Đơn hàng tối thiểu 4.400.000đ (giá trước VAT)","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'FIXED', 1000000, NULL, 4400000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 50 DAY),
    300, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'STD300K',
    'Giảm 300.000đ gói Standard Combo',
    'Tiết kiệm ngay 300.000đ khi mua gói đăng tin tiết kiệm Standard Combo.',
    'STANDARD',
    'EMERALD',
    '["Chỉ áp dụng cho gói Standard Combo (giá trước VAT)","Đơn hàng tối thiểu 2.550.000đ","Mỗi doanh nghiệp được áp dụng tối đa 3 lần"]',
    'FIXED', 300000, NULL, 2550000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 55 DAY),
    450, 0, 3, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'ECO500K',
    'Giảm 500.000đ gói đăng tin Eco Plus',
    'Giảm trực tiếp 500.000đ cho doanh nghiệp đăng ký gói Eco Plus 30 ngày.',
    'ECO PLUS',
    'AMBER',
    '["Chỉ áp dụng cho gói Eco Plus (giá trước VAT)","Đơn hàng tối thiểu 4.400.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'FIXED', 500000, NULL, 4400000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 42 DAY),
    300, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'RETOP250K',
    'Giảm 250.000đ gói Add-on Đẩy Top',
    'Ưu đãi 250.000đ giúp tin tuyển dụng luôn giữ vị trí đầu danh sách việc làm.',
    'TOP BOOST',
    'AMBER',
    '["Chỉ áp dụng cho gói Add-on Đẩy Top","Đơn hàng tối thiểu 1.500.000đ (giá trước VAT)","Mỗi doanh nghiệp được áp dụng tối đa 3 lần"]',
    'FIXED', 250000, NULL, 1500000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 36 DAY),
    400, 0, 3, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'CREDIT600K',
    'Giảm 600.000đ nâng cấp gói Flex Pro',
    'Tiết kiệm ngay 600.000đ khi mua gói 9.000 credits Flex Pro dùng linh hoạt dài hạn.',
    'FLEX PRO',
    'AMBER',
    '["Chỉ áp dụng cho gói Flex Pro (giá trước VAT)","Đơn hàng tối thiểu 8.000.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'FIXED', 600000, NULL, 8000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 48 DAY),
    220, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'HOMEPAGE700K',
    'Giảm 700.000đ Banner Trang chủ Đầu trang',
    'Ưu đãi 700.000đ cho gói Banner Home Top tiếp cận tối đa ứng viên truy cập trang chủ.',
    'HOME TOP',
    'ROSE',
    '["Chỉ áp dụng cho gói Banner Trang chủ - Đầu trang","Đơn hàng tối thiểu 4.000.000đ (giá trước VAT)","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'FIXED', 700000, NULL, 4000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 28 DAY),
    150, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'URGENT150K',
    'Giảm 150.000đ gắn nhãn GẤP & HOT',
    'Giảm trực tiếp 150.000đ giúp tin tuyển dụng thu hút ứng viên ứng tuyển nhanh.',
    'HOT DEAL',
    'ROSE',
    '["Áp dụng cho gói Add-on Nhãn GẤP và Nhãn HOT","Đơn hàng từ 1.000.000đ trở lên","Mỗi doanh nghiệp được áp dụng tối đa 4 lần"]',
    'FIXED', 150000, NULL, 1000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 DAY),
    600, 0, 4, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'FLASH12',
    'Flash Sale giảm 12% đơn từ 3.500.000đ',
    'Giảm 12% tối đa 2.000.000đ cho mọi gói dịch vụ tuyển dụng trong đợt Flash Sale.',
    'MEGA SALE',
    'ROSE',
    '["Áp dụng cho tất cả gói dịch vụ có đơn hàng từ 3.500.000đ","Mức giảm tối đa 2.000.000đ cho mỗi đơn hàng","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'PERCENTAGE', 12, 2000000, 3500000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 DAY),
    250, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'PROTRIAL250',
    'Giảm 250.000đ khi đăng ký gói Pro Trial',
    'Ưu đãi riêng cho gói Pro Trial kèm 50 bonus credits và 14 ngày hiển thị ưu tiên.',
    'PRO TRIAL',
    'BLUE',
    '["Chỉ áp dụng cho gói Pro Trial (giá trước VAT)","Đơn hàng tối thiểu 1.490.000đ","Mỗi doanh nghiệp chỉ áp dụng 1 lần duy nhất"]',
    'FIXED', 250000, NULL, 1490000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 55 DAY),
    400, 0, 1, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'BRAND12',
    'Giảm 12% gói truyền thông thương hiệu',
    'Giảm 12% (tối đa 1.200.000đ) cho gói Brand Page và các vị trí Banner quảng cáo.',
    'BRANDING',
    'BLUE',
    '["Áp dụng cho gói Brand Page và nhóm gói Banner quảng cáo","Đơn hàng tối thiểu 2.000.000đ, giảm tối đa 1.200.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'PERCENTAGE', 12, 1200000, 2000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 50 DAY),
    260, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
),
(
    'Q4HIRING15',
    'Giảm 15% chiến dịch tuyển dụng cao điểm',
    'Ưu đãi tối đa 2.200.000đ cho đơn hàng dịch vụ từ 4.000.000đ trong mùa tuyển dụng.',
    'SEASONAL',
    'BLUE',
    '["Áp dụng trên giá niêm yết của tất cả gói dịch vụ (chưa VAT)","Đơn hàng tối thiểu 4.000.000đ, giảm tối đa 2.200.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần"]',
    'PERCENTAGE', 15, 2200000, 4000000,
    UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 38 DAY),
    350, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()
);

INSERT IGNORE INTO voucher_applicable_packages (voucher_id, package_id)
SELECT v.id, p.id
FROM vouchers v
JOIN service_packages p ON (
    (v.code = 'TOPJOB1M' AND p.code IN ('ECO_PLUS', 'PRO_MAX', 'PRO_MAX_PLUS'))
    OR (v.code = 'STD300K' AND p.code = 'STANDARD_COMBO')
    OR (v.code = 'ECO500K' AND p.code = 'ECO_PLUS')
    OR (v.code = 'RETOP250K' AND p.code = 'ADDON_RETOP')
    OR (v.code = 'CREDIT600K' AND p.code = 'FLEX_PRO')
    OR (v.code = 'HOMEPAGE700K' AND p.code = 'BANNER_HOME_TOP')
    OR (v.code = 'URGENT150K' AND p.code IN ('ADDON_URGENT', 'ADDON_HOT'))
    OR (v.code = 'PROTRIAL250' AND p.code = 'PRO_TRIAL')
    OR (v.code = 'BRAND12' AND p.code IN ('BRAND_PAGE', 'BANNER_HOME_TOP', 'BANNER_HOME_MID', 'BANNER_JOBS_SIDE'))
);

