INSERT INTO service_categories (code, name, headline, description, need_key, display_order, is_active, created_at, updated_at) VALUES
('BANNER', 'BANNER', 'QUẢNG CÁO HIỂN THỊ TRÊN NỀN TẢNG', 'Đặt banner thương hiệu tại các vị trí có lượt xem cao nhất, bán theo tuần và chỉ một doanh nghiệp mỗi tuần.', 'BRANDING', 7, 1, NOW(), NOW());

INSERT INTO service_packages (category_id, code, slug, name, short_description, price, currency, badge, vip_ribbon, accent_color, hero_image_url, validity_days, bonus_credits, one_time_per_company, status, display_order, created_at, updated_at) VALUES
((SELECT id FROM service_categories WHERE code = 'BANNER'), 'BANNER_HOME_TOP', 'banner-home-top', 'BANNER TRANG CHỦ - ĐẦU TRANG', 'Vị trí hiển thị đầu trang chủ, mỗi tuần chỉ một doanh nghiệp. Giá tính theo tuần.', 4000000, 'VND', 'NONE', 1, '#16a34a', NULL, NULL, 0, 0, 'ACTIVE', 1, NOW(), NOW()),
((SELECT id FROM service_categories WHERE code = 'BANNER'), 'BANNER_HOME_MID', 'banner-home-mid', 'BANNER TRANG CHỦ - GIỮA TRANG', 'Vị trí giữa trang chủ, xen giữa các khối nội dung. Giá tính theo tuần.', 2500000, 'VND', 'NONE', 0, '#16a34a', NULL, NULL, 0, 0, 'ACTIVE', 2, NOW(), NOW()),
((SELECT id FROM service_categories WHERE code = 'BANNER'), 'BANNER_JOBS_SIDE', 'banner-jobs-side', 'BANNER TRANG TÌM VIỆC', 'Cột bên trang tìm việc, hiển thị với ứng viên đang chủ động tìm kiếm. Giá tính theo tuần.', 2000000, 'VND', 'NONE', 0, '#16a34a', NULL, NULL, 0, 0, 'ACTIVE', 3, NOW(), NOW());

INSERT INTO service_package_benefits (package_id, entitlement_type, quantity, tier, duration_days, label, display_order, created_at, updated_at) VALUES
((SELECT id FROM service_packages WHERE code = 'BANNER_HOME_TOP'), 'AD_SLOT_WEEK', 1, 1, 7, '01 tuần hiển thị banner đầu trang chủ', 1, NOW(), NOW()),
((SELECT id FROM service_packages WHERE code = 'BANNER_HOME_MID'), 'AD_SLOT_WEEK', 1, 1, 7, '01 tuần hiển thị banner giữa trang chủ', 1, NOW(), NOW()),
((SELECT id FROM service_packages WHERE code = 'BANNER_JOBS_SIDE'), 'AD_SLOT_WEEK', 1, 1, 7, '01 tuần hiển thị banner trang tìm việc', 1, NOW(), NOW());

INSERT INTO ad_slots (code, name, placement, description, width, height, price_per_week, service_package_id, is_active, display_order, created_at, updated_at) VALUES
('HOME_TOP', 'Trang chủ - Đầu trang', 'HOME', 'Ngay dưới thanh tìm kiếm trang chủ, vị trí đập vào mắt đầu tiên.', 1200, 200, 4000000, (SELECT id FROM service_packages WHERE code = 'BANNER_HOME_TOP'), 1, 1, NOW(), NOW()),
('HOME_MID', 'Trang chủ - Giữa trang', 'HOME', 'Xen giữa khối việc làm nổi bật và khối công ty hàng đầu.', 1200, 160, 2500000, (SELECT id FROM service_packages WHERE code = 'BANNER_HOME_MID'), 1, 2, NOW(), NOW()),
('JOBS_SIDEBAR', 'Trang tìm việc - Cột bên', 'JOBS', 'Cột bên danh sách việc làm, theo ứng viên suốt phiên tìm kiếm.', 400, 400, 2000000, (SELECT id FROM service_packages WHERE code = 'BANNER_JOBS_SIDE'), 1, 3, NOW(), NOW());
