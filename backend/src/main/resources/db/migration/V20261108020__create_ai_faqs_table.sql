CREATE TABLE ai_faqs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    embedding TEXT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ai_faqs_active_order (is_active, display_order),
    INDEX idx_ai_faqs_code (code)
);

INSERT INTO ai_faqs (code, category, question, answer, display_order, is_active) VALUES
('sq-company-verification', 'RECRUITER', 'Làm sao để xác thực doanh nghiệp?', 'Để xác thực tài khoản doanh nghiệp và nhận **Tick xanh uy tín** trên nền tảng InterVue, bạn hãy thực hiện theo 4 bước sau:\n1. **Chuẩn bị hồ sơ:** Bản chụp hoặc scan Giấy chứng nhận đăng ký doanh nghiệp (ĐKKD/GPKD) còn hiệu lực và Giấy ủy quyền (nếu người thực hiện không phải đại diện pháp luật).\n2. **Truy cập trang xác thực:** Vào mục [Xác thực doanh nghiệp](/recruiter/company/verification) trên thanh quản trị nhà tuyển dụng.\n3. **Cập nhật thông tin & Tải tài liệu:** Điền mã số thuế, tên pháp nhân đầy đủ và tải lên tài liệu pháp lý định dạng PDF hoặc hình ảnh (dưới 5MB).\n4. **Chờ duyệt:** Đội ngũ kiểm duyệt InterVue sẽ đối chiếu dữ liệu cổng thông tin quốc gia và phản hồi kết quả trong vòng **24 - 48 giờ làm việc**.', 1, 1),

('sq-ats-cv', 'CANDIDATE', 'Làm sao để tạo và tối ưu CV chuẩn ATS?', 'Để tạo và tối ưu CV IT vượt qua hệ thống sàng lọc tự động (ATS) trên InterVue:\n1. **Sử dụng kho mẫu chuẩn:** Truy cập [Mẫu CV Chuẩn ATS](/cv-templates) để chọn mẫu bố cục 1 cột rõ ràng, tiêu chuẩn, không dùng bảng biểu phức tạp.\n2. **Tối ưu từ khóa kỹ năng:** Đưa các từ khóa công nghệ, framework (ví dụ: Java, Spring Boot, React, Docker...) vào phần Kỹ năng và Dự án thực tế.\n3. **Mô tả thành tích có số liệu:** Sử dụng công thức XYZ hoặc mô hình STAR (ví dụ: *Tối ưu hóa hiệu năng truy vấn database giúp giảm 30% thời gian phản hồi API*).\n4. **Chấm điểm bằng AI:** Vào mục [Quản lý CV](/candidate/profile) và nhấn **Chấm điểm CV** để nhận phản hồi chi tiết từ AI.', 2, 1),

('sq-apply-status', 'CANDIDATE', 'Quy trình ứng tuyển và theo dõi trạng thái hồ sơ?', 'Quy trình nộp đơn và theo dõi tiến độ tuyển dụng trên InterVue:\n1. **Tìm việc phù hợp:** Khám phá hàng ngàn việc làm IT tại trang [Tất cả việc làm IT](/jobs).\n2. **Nộp hồ sơ:** Chọn công việc mong muốn và nhấn **Ứng tuyển ngay**, chọn CV đã lưu trên hệ thống hoặc tải CV mới từ máy tính.\n3. **Theo dõi trạng thái:** Truy cập [Hồ sơ & Lịch sử ứng tuyển](/candidate/profile) để theo dõi các giai đoạn: *Đã nộp (Submitted)*, *Đang xem xét (Reviewing)*, *Mời phỏng vấn (Interviewing)*, *Được nhận việc (Offered)* hoặc *Từ chối (Rejected)*.', 3, 1),

('sq-two-factor', 'SECURITY', 'Làm sao để bật xác thực hai yếu tố (2FA)?', 'Để tăng cường bảo mật cho tài khoản của bạn bằng mã xác thực 2 bước (2FA):\n1. **Truy cập Cài đặt:** Vào mục [Bảo mật tài khoản](/account/security).\n2. **Bật 2FA:** Tại phần **Xác thực hai yếu tố**, nhấn nút **Kích hoạt**.\n3. **Quét mã QR:** Mở ứng dụng Google Authenticator hoặc Microsoft Authenticator trên điện thoại và quét mã QR hiển thị trên màn hình.\n4. **Nhập mã OTP:** Điền mã số 6 chữ số từ ứng dụng để hoàn tất kích hoạt.\n5. **Lưu mã khôi phục:** Hãy ghi nhớ hoặc sao lưu 8 mã dự phòng để đăng nhập khi mất thiết bị.', 4, 1),

('sq-ai-interview', 'INTERVIEW', 'InterVue hỗ trợ luyện phỏng vấn giả lập AI như thế nào?', 'Tính năng **Luyện phỏng vấn giả lập AI 1:1** trên InterVue hỗ trợ bạn bứt phá sự nghiệp:\n- **Bộ câu hỏi thực tế:** Câu hỏi kỹ thuật và tình huống chuyên sâu bám sát vị trí ứng tuyển (Frontend, Backend, DevOps, Data...).\n- **Phản hồi theo mô hình STAR:** AI lắng nghe câu trả lời của bạn, phân tích điểm mạnh, điểm yếu và gợi ý cấu trúc trả lời hoàn hảo.\n- **Trải nghiệm ngay tại:** [Định hướng nghề nghiệp & Luyện phỏng vấn](/career-orientation).', 5, 1),

('sq-password-reset', 'SECURITY', 'Làm thế nào để đổi hoặc lấy lại mật khẩu tài khoản?', 'Nếu bạn quên mật khẩu hoặc muốn thay đổi:\n- **Đổi mật khẩu (khi đã đăng nhập):** Truy cập [Đổi mật khẩu](/account/security), nhập mật khẩu cũ và mật khẩu mới.\n- **Quên mật khẩu (khi chưa đăng nhập):** Vào trang [Quên mật khẩu](/forgot-password), nhập địa chỉ email đã đăng ký. Hệ thống sẽ gửi đường dẫn đặt lại mật khẩu trong 15 phút.', 6, 1),

('sq-data-protection', 'POLICY', 'Chính sách bảo vệ dữ liệu cá nhân theo Nghị định 13 của InterVue?', 'InterVue cam kết tuân thủ nghiêm ngặt **Nghị định 13/2023/NĐ-CP** về Bảo vệ dữ liệu cá nhân:\n- Dữ liệu CV, số điện thoại, email của ứng viên chỉ được cung cấp cho Nhà tuyển dụng khi ứng viên chủ động nộp hồ sơ hoặc đồng ý kết nối.\n- Ứng viên có toàn quyền xem, chỉnh sửa, yêu cầu hạn chế xử lý hoặc xóa vĩnh viễn tài khoản và dữ liệu bất cứ lúc nào.\n- Xem chi tiết tại: [Thỏa thuận xử lý dữ liệu](/data-processing-agreement).', 7, 1);

