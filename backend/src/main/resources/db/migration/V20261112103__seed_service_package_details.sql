-- Refine package benefit labels and seed full service detail sections across all 18 catalog packages

UPDATE service_package_benefits b
JOIN service_packages p ON p.id = b.package_id
SET b.label = CASE
    WHEN p.code = 'PRO_TRIAL' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '01 lượt đăng tin tuyển dụng chuẩn IT hiển thị trong 14 ngày'
    WHEN p.code = 'PRO_TRIAL' AND b.entitlement_type = 'JOB_BOOST' THEN 'Hiển thị ưu tiên ở nhóm Việc làm IT nổi bật & đầu kết quả tìm kiếm (14 ngày)'
    WHEN p.code = 'PRO_TRIAL' AND b.entitlement_type = 'CREDIT' THEN 'Tặng 50 credits dùng thử AI Resume Match, AI Soạn JD hoặc đẩy tin'
    WHEN p.code = 'ECO_TRIAL' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '01 lượt đăng tin tuyển dụng chuẩn IT hiển thị trong 14 ngày'
    WHEN p.code = 'ECO_TRIAL' AND b.entitlement_type = 'CREDIT' THEN 'Tặng 30 credits trải nghiệm AI Resume Match hoặc AI Soạn JD'
    WHEN p.code = 'PRO_MAX_PLUS' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '05 lượt đăng tin tuyển dụng hiển thị trong 30 ngày'
    WHEN p.code = 'PRO_MAX_PLUS' AND b.entitlement_type = 'JOB_BOOST' THEN 'Vị trí hiển thị cao nhất tại Box Việc làm nổi bật & đầu tìm kiếm (30 ngày)'
    WHEN p.code = 'PRO_MAX_PLUS' AND b.entitlement_type = 'JOB_ALERT_PUSH' THEN '08 lượt đẩy tin vào email & thông báo gợi ý việc làm IT (2 lần/tuần)'
    WHEN p.code = 'PRO_MAX_PLUS' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '500 lượt AI Resume Match phân tích & chấm điểm CV tự động'
    WHEN p.code = 'PRO_MAX_PLUS' AND b.entitlement_type = 'JOB_LABEL_URGENT' THEN 'Tặng kèm nhãn GẤP nổi bật trong 07 ngày cho cả 05 tin tuyển dụng'
    WHEN p.code = 'PRO_MAX' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '04 lượt đăng tin tuyển dụng hiển thị trong 30 ngày'
    WHEN p.code = 'PRO_MAX' AND b.entitlement_type = 'JOB_BOOST' THEN 'Vị trí hiển thị ưu tiên cao trên trang chủ & danh sách việc làm (30 ngày)'
    WHEN p.code = 'PRO_MAX' AND b.entitlement_type = 'JOB_ALERT_PUSH' THEN '04 lượt đẩy tin vào email & thông báo gợi ý việc làm IT (1 lần/tuần)'
    WHEN p.code = 'PRO_MAX' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '300 lượt AI Resume Match phân tích & chấm điểm CV tự động'
    WHEN p.code = 'ECO_PLUS' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '03 lượt đăng tin tuyển dụng hiển thị trong 30 ngày'
    WHEN p.code = 'ECO_PLUS' AND b.entitlement_type = 'JOB_BOOST' THEN 'Vị trí hiển thị ưu tiên tiêu chuẩn trong danh sách việc làm (30 ngày)'
    WHEN p.code = 'ECO_PLUS' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '150 lượt AI Resume Match phân tích & chấm điểm CV tự động'
    WHEN p.code = 'STANDARD_COMBO' AND b.entitlement_type = 'JOB_POST_SLOT' THEN '03 lượt đăng tin tuyển dụng hiển thị tiêu chuẩn trong 30 ngày'
    WHEN p.code = 'FLEX_BASIC' AND b.entitlement_type = 'CREDIT' THEN '6.500 credits nạp ví doanh nghiệp để quy đổi tiện ích linh hoạt'
    WHEN p.code = 'FLEX_PRO' AND b.entitlement_type = 'CREDIT' THEN '9.000 credits nạp ví doanh nghiệp với ưu đãi đơn giá tốt hơn cho chiến dịch dài hạn'
    WHEN p.code = 'ADDON_URGENT' AND b.entitlement_type = 'JOB_LABEL_URGENT' THEN 'Gắn nhãn GẤP nổi bật ngay trước tiêu đề tin tuyển dụng trong 07 ngày'
    WHEN p.code = 'ADDON_HOT' AND b.entitlement_type = 'JOB_LABEL_HOT' THEN 'Gắn nhãn HOT nổi bật ngay trước tiêu đề tin tuyển dụng trong 07 ngày'
    WHEN p.code = 'ADDON_HIGHLIGHT' AND b.entitlement_type = 'JOB_HIGHLIGHT' THEN 'Hiển thị khung tin nền xanh nổi bật trong danh sách việc làm suốt 07 ngày'
    WHEN p.code = 'ADDON_RETOP' AND b.entitlement_type = 'JOB_RETOP' THEN '07 lượt đẩy tin tức thì lên vị trí đầu danh sách việc làm mới cập nhật'
    WHEN p.code = 'ADDON_AI_MATCH' AND b.entitlement_type = 'AI_RESUME_MATCH' THEN '500 lượt AI Resume Match phân tích & xếp hạng độ phù hợp hồ sơ ứng viên'
    WHEN p.code = 'ADDON_AI_JD' AND b.entitlement_type = 'AI_JD_GENERATE' THEN '100 lượt AI tự động soạn thảo mô tả công việc (JD) chuẩn ngành IT'
    WHEN p.code = 'BRAND_PAGE' AND b.entitlement_type = 'BRAND_PAGE' THEN 'Trang doanh nghiệp nâng cấp (album tối đa 10 ảnh văn hoá & huy hiệu Brand Page) trong 30 ngày'
    WHEN p.code = 'BRAND_PAGE' AND b.entitlement_type = 'FEATURED_COMPANY' THEN 'Ưu tiên xuất hiện trong mục Công ty nổi bật trên InterVue suốt 30 ngày'
    WHEN p.code = 'BANNER_HOME_TOP' AND b.entitlement_type = 'AD_SLOT_WEEK' THEN '01 tuần hiển thị banner độc quyền vị trí Đầu trang chủ (HOME_TOP · 1200×200px)'
    WHEN p.code = 'BANNER_HOME_MID' AND b.entitlement_type = 'AD_SLOT_WEEK' THEN '01 tuần hiển thị banner độc quyền vị trí Giữa trang chủ (HOME_MID · 1200×160px)'
    WHEN p.code = 'BANNER_JOBS_SIDE' AND b.entitlement_type = 'AD_SLOT_WEEK' THEN '01 tuần hiển thị banner độc quyền dải ngang Đầu danh sách việc làm (JOBS_TOP · 1200×160px)'
    ELSE b.label
END,
b.updated_at = NOW()
WHERE p.code IN (
    'PRO_TRIAL', 'ECO_TRIAL', 'PRO_MAX_PLUS', 'PRO_MAX', 'ECO_PLUS', 'STANDARD_COMBO',
    'FLEX_BASIC', 'FLEX_PRO', 'ADDON_URGENT', 'ADDON_HOT', 'ADDON_HIGHLIGHT',
    'ADDON_RETOP', 'ADDON_AI_MATCH', 'ADDON_AI_JD', 'BRAND_PAGE',
    'BANNER_HOME_TOP', 'BANNER_HOME_MID', 'BANNER_JOBS_SIDE'
);

-- 1. PRO_TRIAL
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Vị trí hiển thị ưu tiên trên trang Việc làm IT (Cấp 2)', 'zap', '#16a34a',
'Gói **PRO TRIAL** giúp tin tuyển dụng đầu tiên của doanh nghiệp xuất hiện nổi bật tại khu vực **Việc làm IT nổi bật** và nhóm đầu kết quả tìm kiếm với mức chi phí dùng thử tối ưu.

- Bao gồm **01 tin tuyển dụng** hiển thị liên tục trong **14 ngày**.
- Áp dụng hiệu ứng **ưu tiên hiển thị Cấp 2** trong suốt 14 ngày ngay sau khi kích hoạt trên tin đã xuất bản.
- Theo dõi lượt xem, lượt ứng tuyển và quản lý hồ sơ tập trung tại trang Quản lý tin tuyển dụng.',
'/images/recruiter/services/job-boost-featured.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_TRIAL' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Quà tặng 50 Credits trải nghiệm hệ sinh thái AI & Đẩy tin', 'gift', '#f59e0b',
'Ngay khi đơn hàng hoàn tất thanh toán, hệ thống tự động cộng **50 Credits** vào ví doanh nghiệp để dùng thử các công cụ tuyển dụng thông minh:

- Quy đổi tới **12 lượt AI Resume Match** (4 credits/lượt) để AI chấm điểm độ phù hợp CV theo JD.
- Hoặc sử dụng cho **03 lượt AI soạn thảo JD** chuyên nghiệp (15 credits/lượt).
- Có thể tích luỹ thêm Credits qua các gói **Flex** để đổi gói đẩy tin, nhãn **GẤP/HOT** hoặc **Brand Page**.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_TRIAL' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Điều kiện áp dụng & hướng dẫn kích hoạt', 'shield-check', '#0f766e',
'1. Mỗi doanh nghiệp chỉ được **mua và kích hoạt duy nhất 01 lần** đối với gói thuộc nhóm dùng thử (Trial).
2. Đăng tin tuyển dụng tại mục **Đăng tin**, sau đó vào **Dịch vụ của tôi** để kích hoạt ưu tiên **Cấp 2** trực tiếp lên tin đang hiển thị.
3. Sau 14 ngày kết thúc hiệu ứng ưu tiên, tin tuyển dụng vẫn lưu trữ đầy đủ lịch sử ứng viên đã nộp.',
NULL, 3, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_TRIAL' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 3);

-- 2. ECO_TRIAL
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Trải nghiệm đăng tin tuyển dụng tiết kiệm trong 14 ngày', 'layers', '#16a34a',
'Gói **ECO TRIAL** được thiết kế cho doanh nghiệp mới bắt đầu tuyển dụng trên InterVue cần kiểm chứng chất lượng ứng viên IT với ngân sách nhẹ nhàng nhất.

- Sở hữu **01 lượt đăng tin tuyển dụng** hiển thị đầy đủ trên danh sách việc làm trong **14 ngày**.
- Hiển thị rõ thông tin đãi ngộ, tech stack yêu cầu và cho phép ứng viên nộp CV trực tuyến tức thì.
- Dễ dàng nâng cấp thêm các gói **Add-on nhãn GẤP / HOT** hoặc **Tin nổi bật** nếu vị trí cần tuyển gấp.',
'/images/recruiter/services/job-standard-list.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ECO_TRIAL' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Tặng 30 Credits dùng thử công cụ AI & chính sách dùng thử', 'gift', '#f59e0b',
'- Tặng kèm **30 Credits** trực tiếp vào ví doanh nghiệp, tương đương tối đa **07 lượt AI Resume Match** hoặc **02 lượt AI soạn thảo JD**.
- Áp dụng quy định **01 lần duy nhất cho mỗi doanh nghiệp** đối với gói dùng thử.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ECO_TRIAL' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 3. PRO_MAX_PLUS
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Vị trí hiển thị cao nhất — Box Việc làm IT nổi bật (Cấp 3)', 'award', '#2563eb',
'**PRO MAX PLUS** là gói đăng tin toàn diện nhất của InterVue dành cho chiến dịch tuyển dụng nhiều vị trí cấp cao hoặc mở rộng đội ngũ kỹ sư quy mô lớn.

- Cấp sẵn **05 lượt đăng tin tuyển dụng** có hiệu lực **30 ngày** mỗi tin.
- Xếp hạng **ưu tiên Cấp 3 (cao nhất)** trong danh sách việc làm IT và trang chủ, giúp gia tăng mạnh lượng truy cập và tỷ lệ ứng tuyển chất lượng.',
'/images/recruiter/services/job-boost-featured.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_MAX_PLUS' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Đẩy tin vào Email & Thông báo gợi ý việc làm (08 lượt)', 'megaphone', '#16a34a',
'Tin tuyển dụng của doanh nghiệp được ưu tiên xuất hiện trong luồng **Job Alert** gửi qua email và thông báo trên nền tảng tới các ứng viên IT có hồ sơ kỹ năng phù hợp.

- Tổng cộng **08 lượt đẩy thông báo việc làm** trong chu kỳ 30 ngày (tương đương **2 lần/tuần**).
- Tiếp cận chủ động nhóm ứng viên thụ động có kinh nghiệm trùng khớp ngôn ngữ lập trình và cấp bậc yêu cầu.',
'/images/recruiter/services/job-alert-push.png', 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_MAX_PLUS' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Sàng lọc hồ sơ nhanh với 500 lượt AI Resume Match', 'target', '#2563eb',
'- Trang bị sẵn **500 lượt AI Resume Match** giúp hệ thống tự động đối chiếu CV ứng viên với yêu cầu kỹ thuật của tin tuyển dụng.
- Hiển thị ngay **tỷ lệ % phù hợp**, danh sách kỹ năng đáp ứng, kỹ năng còn thiếu và tóm tắt đánh giá để HR ưu tiên mời phỏng vấn ứng viên sáng giá.',
'/images/recruiter/services/ai-resume-match.png', 3, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_MAX_PLUS' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 3);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Tặng kèm nhãn GẤP 07 ngày cho cả 05 tin tuyển dụng', 'zap', '#dc2626',
'- Tích hợp sẵn **05 lượt gắn nhãn GẤP** (mỗi lượt chạy **07 ngày**) ngay trong gói, không cần mua lẻ Add-on.
- Nhà tuyển dụng chủ động kích hoạt nhãn **GẤP** vào thời điểm cao điểm của từng vị trí trong mục **Dịch vụ của tôi**.',
'/images/recruiter/services/addon-urgent-hot.png', 4, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_MAX_PLUS' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 4);

-- 4. PRO_MAX
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Vị trí hiển thị ưu tiên cao (Cấp 2) cho 04 tin tuyển dụng', 'award', '#16a34a',
'Gói **PRO MAX** cân bằng tối ưu giữa khả năng hiển thị nổi bật, tiếp cận chủ động qua Job Alert và bộ công cụ AI sàng lọc CV.

- Bao gồm **04 lượt đăng tin tuyển dụng** hiển thị **30 ngày**.
- Kích hoạt **ưu tiên hiển thị Cấp 2** trong 30 ngày giúp tin tuyển dụng luôn nằm ở nhóm đầu trang việc làm IT.',
'/images/recruiter/services/job-boost-featured.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_MAX' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Đẩy tin vào thông báo việc làm (04 lượt / 30 ngày)', 'megaphone', '#16a34a',
'- Bao gồm **04 lượt đẩy tin vào Job Alert** (trung bình **1 lần/tuần**), gửi trực tiếp tới ứng viên IT có kỹ năng và khu vực làm việc phù hợp.
- Hỗ trợ gia tăng lượt xem và lượt nộp hồ sơ ngay trong tuần đầu mở tuyển.',
'/images/recruiter/services/job-alert-push.png', 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_MAX' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, '300 lượt AI Resume Match chấm điểm CV tự động', 'target', '#2563eb',
'- Sử dụng **300 lượt AI Resume Match** để tự động chấm điểm, phân tích điểm mạnh và khoảng trống kỹ năng của từng hồ sơ ứng tuyển.
- Tiết kiệm thời gian lọc CV sơ bộ cho các vị trí Frontend, Backend, Mobile, QA và Data.',
'/images/recruiter/services/ai-resume-match.png', 3, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'PRO_MAX' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 3);

-- 5. ECO_PLUS
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Hiển thị ưu tiên tiêu chuẩn (Cấp 1) cho 03 tin tuyển dụng', 'trending-up', '#f59e0b',
'Gói **ECO PLUS** phù hợp với doanh nghiệp tuyển dụng nhiều vị trí cùng lúc với chi phí hợp lý mà vẫn đảm bảo độ phủ tốt trên kết quả tìm kiếm.

- Sở hữu **03 lượt đăng tin tuyển dụng** hiệu lực **30 ngày** mỗi tin.
- Đi kèm **03 lượt hiển thị ưu tiên Cấp 1** trong **30 ngày**, giúp tin xếp trên nhóm tin cơ bản.',
'/images/recruiter/services/job-boost-featured.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ECO_PLUS' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Tích hợp 150 lượt AI Resume Match đánh giá ứng viên', 'target', '#2563eb',
'- Tặng sẵn **150 lượt AI Resume Match** giúp nhà tuyển dụng đánh giá nhanh mức độ khớp kỹ năng giữa hồ sơ ứng viên và mô tả công việc.
- Có thể kết hợp thêm các gói **Add-on** như nhãn **GẤP**, **HOT** hoặc **Đẩy top** tùy mức độ cấp thiết của từng đợt tuyển.',
'/images/recruiter/services/ai-resume-match.png', 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ECO_PLUS' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 6. STANDARD_COMBO
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Combo 03 tin tuyển dụng tiêu chuẩn tiết kiệm chi phí', 'layers', '#16a34a',
'**STANDARD COMBO** là lựa chọn tối ưu ngân sách cho doanh nghiệp duy trì tuyển dụng đều đặn cho nhiều phòng ban kỹ thuật.

- Cung cấp **03 lượt đăng tin tuyển dụng** hiển thị tiêu chuẩn trong **30 ngày** mỗi tin.
- Hiển thị đầy đủ mức lương, thẻ kỹ năng IT, địa điểm làm việc và hồ sơ doanh nghiệp giúp ứng viên dễ dàng tìm thấy qua bộ lọc tìm kiếm.',
'/images/recruiter/services/job-standard-list.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'STANDARD_COMBO' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Linh hoạt nâng cấp hiệu ứng theo từng thời điểm', 'sparkles', '#0f766e',
'- Các lượt đăng tin chưa sử dụng được lưu giữ an toàn trong kho dịch vụ của doanh nghiệp theo thời hạn kích hoạt tiêu chuẩn.
- Khi cần bứt tốc ứng viên cho một vị trí gấp, doanh nghiệp có thể kích hoạt thêm **Add-on nhãn GẤP / HOT**, **Tin nổi bật** hoặc dùng **Credits** linh hoạt ngay trên tin đang chạy.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'STANDARD_COMBO' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 7. FLEX_BASIC
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Ví 6.500 Credits — Quy đổi chủ động mọi tiện ích tuyển dụng', 'gift', '#16a34a',
'Gói **FLEX BASIC** nạp ngay **6.500 Credits** vào ví doanh nghiệp (với mức thưởng +500 Credits so với mệnh giá), cho phép HR chủ động phân bổ ngân sách theo nhu cầu thực tế từng tuần.

- **Không bị gò bó vào một loại dịch vụ cố định**: thiếu lượt đăng tin thì đổi slot đăng tin, cần gấp thì đổi nhãn GẤP hoặc Đẩy top, cần lọc hồ sơ thì đổi lượt AI.
- Mọi biến động cộng/trừ Credits đều được ghi nhận minh bạch trong **Lịch sử giao dịch & Ví Credits**.',
'/images/recruiter/services/credit-wallet-flex.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'FLEX_BASIC' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Bảng quy đổi tham khảo với 6.500 Credits', 'bar-chart-3', '#2563eb',
'- **Đăng 01 tin tuyển dụng (30 ngày):** 900 Credits
- **Ưu tiên hiển thị (Job Boost 30 ngày):** 450 Credits (Cấp 1) · 700 Credits (Cấp 2) · 1.000 Credits (Cấp 3)
- **Add-on 07 ngày:** Nhãn GẤP (1.000 Cr) · Nhãn HOT (1.000 Cr) · Tin nổi bật (1.200 Cr)
- **Đẩy top (Re-top):** 220 Credits/lượt · **Job Alert Push:** 400 Credits/lượt
- **Công cụ AI:** AI Resume Match (**4 Credits/lượt**) · AI Soạn JD (**15 Credits/lượt**)
- **Thương hiệu (30 ngày):** Brand Page (3.000 Cr) · Công ty nổi bật (2.000 Cr)',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'FLEX_BASIC' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 8. FLEX_PRO
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Ví 9.000 Credits — Tối ưu đơn giá cho chiến dịch tuyển dụng dài hạn', 'gift', '#16a34a',
'Gói **FLEX PRO** mang lại tổng **9.000 Credits** với mức ưu đãi thưởng thêm **+1.000 Credits** (lợi hơn 12,5% giá trị quy đổi), lý tưởng cho doanh nghiệp tuyển dụng liên tục qua nhiều quý.

- Chủ động quy đổi theo bảng giá Credits thống nhất trên toàn hệ thống InterVue bất kỳ lúc nào.
- Dùng chung thuận tiện cho toàn bộ thành viên tuyển dụng thuộc cùng doanh nghiệp.',
'/images/recruiter/services/credit-wallet-flex.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'FLEX_PRO' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Gợi ý kết hợp 9.000 Credits đạt hiệu quả cao nhất', 'bar-chart-3', '#2563eb',
'Với **9.000 Credits**, đội ngũ HR có thể linh hoạt phối hợp cùng lúc nhiều hạng mục:

- Ví dụ combo cho 01 đợt tuyển trọng điểm: **04 tin tuyển dụng** (3.600 Cr) + **04 lượt Boost Cấp 2** (2.800 Cr) + **01 Brand Page 30 ngày** (3.000 Cr) hoặc thay thế bằng **06 lượt Đẩy top** (1.320 Cr) và **300 lượt AI Resume Match** (1.200 Cr).
- Kiểm tra số dư và quy đổi tức thì tại trang **Dịch vụ của tôi → Ví Credits**.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'FLEX_PRO' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 9. ADDON_URGENT
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Nhãn GẤP nổi bật — Thu hút ứng viên IT nộp hồ sơ ngay', 'zap', '#dc2626',
'Khi kích hoạt **Add-on Nhãn GẤP**, tin tuyển dụng được gắn huy hiệu **GẤP** màu đỏ tương phản cao ngay trước tiêu đề tin trên cả trang chủ lẫn trang danh sách việc làm.

- Hiệu lực hiển thị nhãn liên tục trong **07 ngày** kể từ lúc kích hoạt.
- Đặc biệt hiệu quả cho các vị trí cần lấp chỗ trống nhanh hoặc sắp đóng hạn nhận CV.',
'/images/recruiter/services/addon-urgent-hot.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_URGENT' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Điều kiện kích hoạt & lưu ý sử dụng', 'shield-check', '#dc2626',
'- Áp dụng cho **01 tin tuyển dụng đang ở trạng thái Đang hiển thị (Published)** của doanh nghiệp.
- Tại cùng một thời điểm, mỗi tin chỉ gắn tối đa **01 loại nhãn** (**GẤP** hoặc **HOT**); khi nhãn hết hạn 07 ngày có thể kích hoạt lượt mới.
- Có thể mua nhiều gói hoặc kết hợp cùng gói **Top Jobs** để tối đa hoá lượt hiển thị.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_URGENT' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 10. ADDON_HOT
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Nhãn HOT — Đánh dấu vị trí trọng điểm thu hút nhân tài IT', 'zap', '#ea580c',
'**Add-on Nhãn HOT** gắn huy hiệu **HOT** màu cam nổi bật ngay trước tiêu đề tin, tạo tín hiệu thu hút thị giác đối với các vị trí chiến lược hoặc có chế độ đãi ngộ cạnh tranh.

- Duy trì hiển thị nhãn **HOT** liên tục trong **07 ngày** trên trang việc làm và các thẻ gợi ý nổi bật.
- Giúp tăng tỷ lệ nhấp xem chi tiết tin tuyển dụng giữa hàng trăm tin đăng cùng phân khúc.',
'/images/recruiter/services/addon-urgent-hot.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_HOT' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Điều kiện kích hoạt & phối hợp hiệu ứng', 'shield-check', '#ea580c',
'- Kích hoạt lên **01 tin tuyển dụng đang mở** trong mục **Dịch vụ của tôi**.
- Không áp dụng song song cùng nhãn **GẤP** trên cùng một tin tại cùng thời điểm, nhưng có thể kết hợp đồng thời với **Add-on Tin nổi bật** và **Add-on Đẩy top**.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_HOT' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 11. ADDON_HIGHLIGHT
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Khung tin nền xanh nổi bật — Tách biệt hoàn toàn khỏi tin thường', 'sparkles', '#16a34a',
'**Add-on Tin nổi bật** tô phủ khung nền màu xanh ngọc dịu mắt cùng đường viền nhấn riêng biệt cho thẻ tin tuyển dụng trên trang chủ và danh sách việc làm IT.

- Hiệu lực **07 ngày** kể từ thời điểm nhà tuyển dụng bấm kích hoạt lên tin đang đăng.
- Thu hút ánh nhìn tự nhiên của ứng viên khi lướt danh sách kết quả tìm kiếm dài.',
'/images/recruiter/services/addon-highlight.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_HIGHLIGHT' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Tối ưu hiệu quả khi kết hợp cùng Top Jobs & Nhãn tiêu đề', 'trending-up', '#0f766e',
'- Khung tin nổi bật phát huy hiệu quả cao nhất khi kết hợp cùng vị trí xếp hạng từ các gói **Top Jobs** hoặc gắn thêm nhãn **GẤP / HOT**.
- Sau 07 ngày, hệ thống tự động đưa giao diện thẻ tin về mặc định mà không làm gián đoạn trạng thái hiển thị của tin.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_HIGHLIGHT' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 12. ADDON_RETOP
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Đẩy Top tức thì — Làm mới thứ hạng tin trên đầu danh sách', 'trending-up', '#16a34a',
'**Add-on Đẩy Top** cung cấp **07 lượt làm mới thời điểm hiển thị**, đưa tin tuyển dụng nhảy ngay lên vị trí đầu tiên trong nhóm việc làm mới cập nhật.

- Mỗi lượt kích hoạt có tác dụng tức thì ngay tại thời điểm nhấn đẩy tin.
- Linh hoạt phân bổ 07 lượt cho nhiều tin tuyển dụng khác nhau hoặc đẩy lặp lại định kỳ cho một vị trí trọng điểm.',
'/images/recruiter/services/addon-retop.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_RETOP' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Mẹo sử dụng 07 lượt Đẩy Top đạt nhiều CV nhất', 'clock', '#0f766e',
'1. Kích hoạt vào các khung giờ ứng viên IT truy cập cao (sáng **9:00–11:00**, chiều **14:00–16:30** hoặc buổi tối **20:00–21:30**).
2. Thực hiện trực tiếp từ màn hình **Dịch vụ của tôi** lên bất kỳ tin tuyển dụng nào đang ở trạng thái **Đang hiển thị**.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_RETOP' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 13. ADDON_AI_MATCH
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'AI Resume Match — Tự động phân tích & chấm điểm CV theo JD', 'target', '#2563eb',
'Gói **Add-on AI Resume Match** bổ sung ngay **500 lượt phân tích hồ sơ bằng trí tuệ nhân tạo** vào kho tiện ích của doanh nghiệp, giúp đội ngũ HR xử lý khối lượng CV lớn nhanh gấp nhiều lần.

- Chấm điểm **tỷ lệ % mức độ phù hợp** giữa từng CV ứng tuyển với mô tả và yêu cầu kỹ năng trong JD.
- Bóc tách rõ **kỹ năng đã đáp ứng**, **kỹ năng còn thiếu** và tóm tắt nhận xét chuyên môn phục vụ bước lọc hồ sơ & phỏng vấn.',
'/images/recruiter/services/ai-resume-match.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_AI_MATCH' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Phạm vi sử dụng cho toàn bộ đội ngũ tuyển dụng', 'check-circle-2', '#2563eb',
'- Không giới hạn tin tuyển dụng áp dụng: dùng chung cho mọi vị trí Backend, Frontend, Mobile, AI/Data, DevOps của doanh nghiệp.
- Lượt **AI Resume Match** được trừ tự động theo từng lần phân tích CV trong quy trình quản lý ứng viên.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_AI_MATCH' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 14. ADDON_AI_JD
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'AI JD Generator — Khởi tạo mô tả công việc IT chuyên nghiệp', 'sparkles', '#2563eb',
'Gói **Add-on AI JD Generator** cung cấp **100 lượt AI hỗ trợ soạn thảo mô tả công việc**, giúp HR và Hiring Manager hoàn thiện bản JD chuẩn mực chỉ trong vài giây.

- Tự động cấu trúc đầy đủ **Mô tả công việc**, **Yêu cầu ứng viên**, **Tech stack** và **Quyền lợi hấp dẫn** theo đúng đặc thù từng vị trí IT.
- Tối ưu từ khóa chuyên ngành giúp tin tuyển dụng dễ lên kết quả tìm kiếm và truyền tải rõ ràng kỳ vọng tới ứng viên.',
'/images/recruiter/services/ai-jd-generator.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_AI_JD' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Quy trình sử dụng ngay trong màn hình Đăng tin', 'check-circle-2', '#2563eb',
'1. Truy cập **Đăng tin tuyển dụng** và nhập nhanh chức danh, cấp bậc cùng công nghệ sử dụng.
2. Nhấn **Tạo JD bằng AI** để nhận bản nháp hoàn chỉnh, sau đó tùy chỉnh lại theo văn phong riêng của doanh nghiệp trước khi xuất bản.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'ADDON_AI_JD' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 15. BRAND_PAGE
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Nâng cấp Trang doanh nghiệp (Brand Page) chuyên nghiệp', 'award', '#16a34a',
'Gói **BRAND PAGE** nâng tầm hồ sơ nhà tuyển dụng trên InterVue thành trang giới thiệu thương hiệu bài bản, gia tăng sự tin tưởng của ứng viên kỹ thuật trước khi bấm nộp hồ sơ.

- Mở khóa **album tối đa 10 ảnh văn hóa doanh nghiệp**, không gian làm việc và hoạt động đội ngũ.
- Gắn huy hiệu nhận diện **Brand Page** nổi bật trên hồ sơ công ty trong suốt **30 ngày** hiệu lực.',
'/images/recruiter/services/brand-page-showcase.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BRAND_PAGE' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Ưu tiên hiển thị trong mục Công ty nổi bật suốt 30 ngày', 'star', '#f59e0b',
'- Doanh nghiệp đồng thời nhận quyền lợi **Công ty nổi bật (Featured Company) 30 ngày**, được ưu tiên giới thiệu trên trang chủ và trang danh sách công ty IT.
- Kết hợp đồng bộ với các tin tuyển dụng đang mở giúp ứng viên dễ dàng khám phá toàn bộ cơ hội nghề nghiệp tại doanh nghiệp.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BRAND_PAGE' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Hướng dẫn kích hoạt và cập nhật bộ nhận diện', 'shield-check', '#0f766e',
'- Sau khi thanh toán thành công, vào **Dịch vụ của tôi** để kích hoạt gói **Brand Page** và **Công ty nổi bật** cho doanh nghiệp.
- Tải ảnh bìa, logo và tối đa 10 ảnh văn hóa tại mục **Hồ sơ công ty** để hoàn thiện giao diện hiển thị với ứng viên.',
NULL, 3, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BRAND_PAGE' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 3);

-- 16. BANNER_HOME_TOP
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Vị trí Banner Đầu trang chủ (HOME_TOP · 1200×200px)', 'megaphone', '#16a34a',
'**BANNER TRANG CHỦ - ĐẦU TRANG** là vị trí quảng cáo thương hiệu có độ phủ và tỷ lệ ghi nhận cao nhất trên toàn hệ thống InterVue.

- Đặt **ngay dưới thanh tìm kiếm trang chủ**, thu hút ánh nhìn đầu tiên của 100% ứng viên và nhà tuyển dụng truy cập trang chủ.
- **Độc quyền 01 doanh nghiệp mỗi tuần** (Thứ Hai – Chủ Nhật), đảm bảo thông điệp tuyển dụng không bị chia sẻ với đối thủ khác.
- Kích thước thiết kế khuyến nghị: **1200×200px** (PNG/JPG rõ nét).',
'/images/recruiter/services/banner-home-top.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BANNER_HOME_TOP' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Quy trình đặt tuần hiển thị, gửi thiết kế & đo lường hiệu quả', 'bar-chart-3', '#2563eb',
'1. Chọn trực tiếp **1 hoặc nhiều tuần còn trống** trên lịch hiển thị ngay tại trang này và hoàn tất thanh toán.
2. Truy cập mục **Banner ads** (`/recruiter/ads`) để tải ảnh banner và gắn liên kết đích (trang công ty hoặc chiến dịch tuyển dụng).
3. Admin kiểm duyệt nhanh trước ngày chạy; theo dõi trực tiếp **lượt hiển thị (impressions)** và **lượt nhấp (clicks)** theo từng tuần đặt chỗ.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BANNER_HOME_TOP' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 17. BANNER_HOME_MID
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Vị trí Banner Giữa trang chủ (HOME_MID · 1200×160px)', 'megaphone', '#16a34a',
'**BANNER TRANG CHỦ - GIỮA TRANG** nằm xen giữa khối **Việc làm IT nổi bật** và **Công ty hàng đầu**, tiếp cận tự nhiên đúng thời điểm ứng viên đang khám phá cơ hội nghề nghiệp.

- **Độc quyền hiển thị 01 doanh nghiệp duy nhất trong mỗi tuần** đã đặt lịch.
- Tối ưu ngân sách truyền thông thương hiệu tuyển dụng quy mô lớn với chi phí cạnh tranh hơn đầu trang.
- Kích thước thiết kế khuyến nghị: **1200×160px** (tỷ lệ ngang rộng 15:2).',
'/images/recruiter/services/banner-home-mid.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BANNER_HOME_MID' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Quy trình đặt lịch & thống kê chiến dịch', 'bar-chart-3', '#2563eb',
'1. Chọn tuần hiển thị mong muốn trên **Lịch banner** (giá tính theo tuần, có thể đặt nhiều tuần liên tiếp).
2. Tải ảnh banner đúng chuẩn **1200×160px** tại mục **Banner ads** để Admin duyệt trước tuần phát sóng và theo dõi báo cáo lượt xem/nhấp theo thời gian thực.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BANNER_HOME_MID' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);

-- 18. BANNER_JOBS_SIDE
INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Vị trí Banner Đầu danh sách việc làm (JOBS_TOP · 1200×160px)', 'megaphone', '#16a34a',
'**BANNER TRANG TÌM VIỆC** hiển thị dưới dạng **dải banner ngang ngay trên đầu danh sách kết quả tìm kiếm (`/jobs`)**, tiếp cận chính xác nhóm ứng viên IT đang chủ động tìm kiếm việc làm.

- Bám sát hành vi tìm kiếm và lọc việc làm của ứng viên ở tần suất cao trong suốt tuần phát sóng.
- **Chỉ 01 doanh nghiệp độc quyền mỗi tuần** tại vị trí `JOBS_TOP`.
- Kích thước thiết kế chuẩn: **1200×160px** (khớp với dải ngang phía trên danh sách việc làm).',
'/images/recruiter/services/banner-jobs-top.png', 1, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BANNER_JOBS_SIDE' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 1);

INSERT INTO service_package_sections (package_id, heading, icon_name, accent_color, body, image_url, display_order, created_at, updated_at)
SELECT p.id, 'Tiếp cận ứng viên có ý định ứng tuyển cao', 'users', '#2563eb',
'1. Đặt tuần còn trống trên lịch tuần hiển thị ngay tại trang chi tiết dịch vụ.
2. Upload banner 1200×160px tại **Banner ads**, dẫn trực tiếp về trang giới thiệu công ty hoặc danh sách vị trí IT đang mở tuyển của doanh nghiệp để tối đa hoá chuyển đổi hồ sơ.',
NULL, 2, NOW(), NOW()
FROM service_packages p
WHERE p.code = 'BANNER_JOBS_SIDE' AND NOT EXISTS (SELECT 1 FROM service_package_sections s WHERE s.package_id = p.id AND s.display_order = 2);
