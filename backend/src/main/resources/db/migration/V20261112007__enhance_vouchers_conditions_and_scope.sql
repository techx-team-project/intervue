ALTER TABLE vouchers
    ADD COLUMN ribbon_label VARCHAR(40) NULL AFTER description,
    ADD COLUMN accent_color VARCHAR(20) NOT NULL DEFAULT 'EMERALD' AFTER ribbon_label,
    ADD COLUMN conditions_json TEXT NULL AFTER accent_color;

CREATE TABLE voucher_applicable_packages (
    voucher_id BIGINT UNSIGNED NOT NULL,
    package_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (voucher_id, package_id),
    CONSTRAINT fk_vap_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers (id) ON DELETE CASCADE,
    CONSTRAINT fk_vap_package FOREIGN KEY (package_id) REFERENCES service_packages (id) ON DELETE CASCADE,
    INDEX idx_vap_package (package_id)
);

UPDATE vouchers
SET
    ribbon_label = 'ALL PACKAGES',
    accent_color = 'EMERALD',
    conditions_json = '["Áp dụng trên giá niêm yết của gói dịch vụ (chưa bao gồm VAT)","Đơn hàng tối thiểu 2.000.000đ, mức giảm tối đa 2.500.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần trong chương trình"]'
WHERE code = 'INTERVUE25' AND conditions_json IS NULL;

UPDATE vouchers
SET
    ribbon_label = 'TOP JOBS',
    accent_color = 'AMBER',
    conditions_json = '["Áp dụng trên giá niêm yết của gói dịch vụ (chưa bao gồm VAT)","Đơn hàng tối thiểu 1.500.000đ, mức giảm tối đa 2.000.000đ","Mỗi doanh nghiệp được áp dụng tối đa 2 lần trong chương trình"]'
WHERE code = 'INTERVUE20' AND conditions_json IS NULL;

UPDATE vouchers
SET
    ribbon_label = 'WELCOME',
    accent_color = 'BLUE',
    conditions_json = '["Dành cho nhà tuyển dụng mới trải nghiệm dịch vụ InterVue","Không yêu cầu giá trị đơn hàng tối thiểu, giảm tối đa 1.500.000đ","Mã ưu đãi chỉ được áp dụng 1 lần cho 1 doanh nghiệp"]'
WHERE code = 'NEWBIE15' AND conditions_json IS NULL;

UPDATE vouchers
SET
    ribbon_label = 'FLASH DEAL',
    accent_color = 'ROSE',
    conditions_json = '["Giảm trực tiếp 500.000đ cho đơn hàng dịch vụ từ 3.000.000đ","Không áp dụng đồng thời với các chương trình khuyến mãi khác","Mỗi doanh nghiệp được áp dụng tối đa 2 lần trong chương trình"]'
WHERE code = 'SAVE500K' AND conditions_json IS NULL;

