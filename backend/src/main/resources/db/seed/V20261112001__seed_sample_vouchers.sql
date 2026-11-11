INSERT IGNORE INTO vouchers (
    code, label, description, discount_type, discount_value, max_discount,
    min_order_value, starts_at, ends_at, usage_limit, used_count,
    per_company_limit, status, created_at, updated_at
) VALUES
('INTERVUE25', 'Giảm 25% tổng giá trị đơn hàng', 'Ưu đãi tối đa 2.500.000đ cho đơn hàng dịch vụ từ 2.000.000đ.', 'PERCENTAGE', 25, 2500000, 2000000, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 19 DAY), 500, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('INTERVUE20', 'Giảm 20% tổng giá trị đơn hàng', 'Ưu đãi tối đa 2.000.000đ cho đơn hàng dịch vụ từ 1.500.000đ.', 'PERCENTAGE', 20, 2000000, 1500000, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 19 DAY), 500, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('NEWBIE15', 'Giảm 15% cho nhà tuyển dụng mới', 'Giảm 15% tổng đơn hàng, tối đa 1.500.000đ, áp dụng mọi gói dịch vụ.', 'PERCENTAGE', 15, 1500000, 0, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY), 1000, 0, 1, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('SAVE500K', 'Giảm ngay 500.000đ cho đơn từ 3.000.000đ', 'Giảm trực tiếp 500.000đ tổng giá trị đơn hàng từ 3.000.000đ trở lên.', 'FIXED', 500000, NULL, 3000000, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY), 300, 0, 2, 'ACTIVE', UTC_TIMESTAMP(), UTC_TIMESTAMP());

