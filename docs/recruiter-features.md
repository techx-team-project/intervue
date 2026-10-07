# InterVue — Đặc tả chức năng: Nhà tuyển dụng (Recruiter)

**Phiên bản 1.1 · 07/10/2026**

Tài khoản Nhà tuyển dụng (NTD) và tài khoản Ứng viên là **hai tài khoản tách biệt**. Cùng một email được phép đăng ký ở cả hai cổng, nhưng mỗi cổng đăng ký, đăng nhập và quản lý thông tin riêng.

**Tư cách tuyển dụng:** chỉ **Doanh nghiệp** và **Hộ kinh doanh**.

**Dùng chung với tài liệu Ứng viên:** thuật ngữ (Job, Tin tuyển dụng, mọi job đều có lương), danh mục (vị trí, cấp bậc, kỹ năng, địa điểm), trạng thái hồ sơ ứng tuyển, quy tắc chung cho AI.

**Mã NTD:** mỗi tài khoản có một mã hiển thị, dùng khi liên hệ hỗ trợ.

Các mục ghi **[Đề xuất]** là lựa chọn của InterVue, chưa đối chiếu được với TopCV.

---

## 1. Đăng ký

**Phương thức:** Google, Facebook, LinkedIn, Email (form).

**Luồng:**
1. Tick đồng ý **Chính sách & Điều khoản**; chưa đồng ý thì các nút đăng ký bị khóa.
2. Đăng ký nhanh bằng mạng xã hội, hoặc bằng form.

**Form đăng ký:**
- *Thông tin đăng nhập:* Email, Mật khẩu, Nhập lại mật khẩu.
- *Thông tin tuyển dụng:* Họ và tên, Giới tính (**bắt buộc**), Số điện thoại cá nhân, Tên công ty, Địa điểm làm việc (Tỉnh/Thành phố), Phường/Xã.

**Mạng xã hội:**
- Lấy email từ mạng xã hội; người dùng chỉ nhập **Thông tin tuyển dụng**.
- Không trả về email: báo lỗi, hướng dẫn dùng phương thức khác.
- Gửi mật khẩu mặc định (ngẫu nhiên, tuân theo quy tắc mật khẩu) về email.
- Email trùng tài khoản NTD đã có: tự động liên kết nếu mạng xã hội xác nhận email đã xác minh; gửi email thông báo.

**Xác minh email, quy tắc mật khẩu:** giống tài liệu Ứng viên (mục 2).

**Email:** duy nhất trong các **tài khoản NTD**.

---

## 2. Đăng nhập, Quên mật khẩu, Bảo mật

Giống tài liệu Ứng viên: CAPTCHA sau 3 lần sai (mục 3), quên mật khẩu (mục 4), **2FA**, mã khôi phục, quản lý thiết bị, liên kết mạng xã hội, đổi mật khẩu, đổi email (mục 5.10).

Chưa bật 2FA: hiển thị nhãn **"Tài khoản chưa đủ an toàn"**, bấm vào dẫn tới trang bật 2FA.

---

## 3. Nhu cầu tuyển dụng (sau đăng ký)

Cho phép **bỏ qua**; cập nhật lại trong Cài đặt.

| Câu hỏi | Trả lời |
|---|---|
| Bạn đang tuyển vị trí chuyên môn nào? | Danh mục vị trí |
| Cấp bậc | Danh mục cấp bậc |
| Thời gian cần tuyển xong | Chọn ngày, hoặc **"Tuyển liên tục"** |
| Số lượng cần tuyển | Số |
| Ngân sách tuyển dụng cho vị trí này | Khoảng từ – đến |
| Nguồn ngân sách | Công ty / Cá nhân |
| Bạn có cần tư vấn thêm không? | Văn bản (không bắt buộc) |

- Dùng để **gợi ý gói dịch vụ** trên Bảng tin.
- Yêu cầu tư vấn chuyển vào **hàng chờ Admin**.

---

## 4. Bảng tin (Dashboard)

### 4.1. Xác thực tài khoản
Hiển thị **cấp xác thực** (ví dụ "Cấp 1/3"), **% hoàn thành** các bước để lên cấp tiếp theo, và quyền lợi khi nâng cấp (ví dụ *"Nâng cấp tài khoản lên cấp 2/3 để nhận 100 lượt xem CV ứng viên từ công cụ tìm kiếm CV"*). Mỗi bước bấm vào dẫn sang Cài đặt.

### 4.2. Tổng quan
- Chiến dịch đang mở; tin đang hiển thị.
- Hồ sơ mới; hồ sơ chưa xử lý quá 7 ngày.
- Lịch phỏng vấn sắp tới.
- Credit, lượt xem CV, lượt đăng tin miễn phí còn lại.
- Dịch vụ đang chạy và thời hạn.
- Gợi ý gói dịch vụ theo nhu cầu tuyển dụng.

### 4.3. Banner cảnh báo
- Chưa đồng ý Thỏa thuận xử lý dữ liệu cá nhân: *"Tin tuyển dụng sẽ không nhận được CV cho đến khi bạn cập nhật Thỏa thuận xử lý dữ liệu cá nhân."*
- Chưa bật 2FA.

---

## 5. Xác thực tài khoản

### 5.1. Ba cấp xác thực

| Cấp | Điều kiện | Quyền lợi |
|---|---|---|
| **Cấp 1/3** | Đăng ký + xác minh email | Cập nhật thông tin, tạo chiến dịch, soạn tin nháp, mua dịch vụ |
| **Cấp 2/3** | Hoàn thành cả 3 bước: **Xác thực số điện thoại**, **Cập nhật thông tin công ty**, **Xác thực Giấy đăng ký doanh nghiệp / hộ kinh doanh** (Admin duyệt) | Nhận **lượt đăng tin miễn phí** (mục 8.4); **100 lượt xem CV** từ Tìm ứng viên; nhãn xác thực trên tin và trang công ty |
| **Cấp 3/3** | **[Đề xuất]** Cấp 2 + **xác thực email theo tên miền công ty** (nhận mã qua email @tên-miền-công-ty) | **[Đề xuất]** Thêm **100 lượt xem CV**; nhãn **"Nhà tuyển dụng xác thực cấp cao"** |

**Điều kiện riêng để nhận CV:** đã đồng ý cả hai Thỏa thuận xử lý dữ liệu cá nhân (mục 5.3).

NTD **không** cần eKYC.

### 5.2. Xác thực số điện thoại
- OTP qua **Zalo hoặc SMS** (nhà cung cấp: *đang tìm hiểu*).
- Mã 6 chữ số, hết hạn **5 phút**; gửi lại sau **60 giây**, tối đa **3 lần / 15 phút**; nhập sai **5 lần** thì mã bị hủy.

### 5.3. Thỏa thuận xử lý dữ liệu cá nhân

| Thỏa thuận | Cách thực hiện |
|---|---|
| **Với InterVue** | Đọc và đồng ý trực tuyến |
| **Với ứng viên** | Đồng ý trực tuyến với **mẫu chuẩn của InterVue**; hoặc tải mẫu về, dùng mẫu riêng của doanh nghiệp và upload lên, Admin duyệt |

Có hướng dẫn nội dung cần có. Nội dung mẫu chuẩn: *(Đang cập nhật — cần người làm pháp lý soạn)*.

---

## 6. Thông tin công ty

### 6.1. Tư cách
Doanh nghiệp / Hộ kinh doanh.

### 6.2. Chọn hoặc tạo công ty
- **Chọn công ty có sẵn:** tìm theo mã số thuế hoặc tên.
- **Thêm mới:** nhập mã số thuế; tra cứu để tự điền tên và địa chỉ (nguồn tra cứu: *đang tìm hiểu*).
- Cảnh báo: *"Vui lòng nhập Mã số thuế và Tên công ty trùng khớp với dữ liệu doanh nghiệp trên Trang thông tin điện tử của Cục Thuế."*

### 6.3. Thông tin công ty

| Thông tin | Ghi chú |
|---|---|
| Logo | Hoặc tick "Tôi không có logo" |
| Mã số thuế | Bắt buộc |
| Tên công ty | Bắt buộc, khớp dữ liệu Cục Thuế |
| Ngành nghề kinh doanh | Cập nhật theo giấy phép đã nhập, trong 24 giờ làm việc |
| Tên thương mại | Bắt buộc. Tick "Tên thương mại trùng với tên đăng ký kinh doanh", hoặc upload giấy tờ chứng minh |
| Website | Bắt buộc, hoặc tick "Tôi không có website" |
| Thị trường hoạt động | Chọn nhiều |
| Khách hàng mục tiêu | Chọn nhiều |
| Quy mô | Bắt buộc |
| Email, số điện thoại | Bắt buộc |
| Địa chỉ | Bắt buộc |
| Mô tả công ty | Bắt buộc, khuyến nghị ≥ 500 ký tự, tối đa 10.000 ký tự |
| Phúc lợi nhân viên | Tối đa 10.000 ký tự |
| Hình ảnh công ty | Tỷ lệ 3:2, khuyến nghị 1200 × 800 px |

### 6.4. Khóa thông tin sau khi tạo
- NTD **không tự sửa** thông tin công ty sau khi tạo.
- Muốn thay đổi: gửi yêu cầu kèm **giấy phép** và **lý do** → Admin duyệt.
- Trong thời gian chờ duyệt, tin tiếp tục dùng thông tin cũ.

### 6.5. Giấy phép và quyền đại diện

| Trường hợp | Giấy tờ |
|---|---|
| Doanh nghiệp | Giấy chứng nhận đăng ký doanh nghiệp |
| Hộ kinh doanh | Giấy chứng nhận đăng ký hộ kinh doanh |
| Chọn công ty **đã có** trên InterVue | Thêm **bằng chứng quyền đại diện tuyển dụng**: giấy giới thiệu / giấy ủy quyền có dấu công ty |

- Admin duyệt trong **24 giờ làm việc**: Duyệt / Từ chối kèm lý do / Yêu cầu bổ sung.
- Nhãn hiển thị: **"Doanh nghiệp đã xác thực"** / **"Hộ kinh doanh đã xác thực"**.

### 6.6. Nhiều NTD cùng một công ty
Mỗi NTD được duyệt riêng và **không thấy** chiến dịch, tin, hồ sơ, dịch vụ của nhau.

---

## 7. Chiến dịch tuyển dụng

- Mỗi chiến dịch là **một vị trí cần tuyển**, chứa **một tin tuyển dụng**.
- Tạo chiến dịch trước, sau đó soạn và đăng tin. Chiến dịch có thể chưa có tin.
- Trong chiến dịch: tin, hồ sơ ứng tuyển, CV đề xuất, dịch vụ đang áp dụng, báo cáo.
- Tin hết hạn: **gia hạn** hoặc **đăng lại** trong cùng chiến dịch; lịch sử hồ sơ giữ nguyên.

| Trạng thái | Ý nghĩa |
|---|---|
| Đang mở | Đang tuyển |
| Tạm dừng | Tin tạm dừng nhận hồ sơ |
| Đã đóng | Kết thúc tuyển dụng |

---

## 8. Tin tuyển dụng

### 8.1. Nội dung tin
- Tiêu đề; vị trí chuyên môn; cấp bậc; kỹ năng yêu cầu (theo danh mục).
- Số lượng cần tuyển.
- Hình thức làm việc: On-site / Hybrid / Remote / Linh hoạt.
- Loại hợp đồng: Toàn thời gian / Bán thời gian / Thực tập.
- Địa điểm làm việc: một hoặc nhiều; chọn địa chỉ trụ sở hoặc nhập địa chỉ khác.
- Mức lương (mục 8.2).
- Kinh nghiệm yêu cầu; mô tả công việc; yêu cầu ứng viên; quyền lợi.
- Hạn nộp hồ sơ: chọn ngày và giờ cụ thể theo mong muốn
- Thời gian hiển thị: chọn ngày và giờ cụ thể theo mong muốn (cần giới hạn tối đa)
- Hạn nộp hồ sơ.
- Hình thức nộp hồ sơ (mục 8.3).

**AI hỗ trợ soạn tin:**
- **Gợi ý JD:** NTD nhập vị trí và cấp bậc → AI viết bản nháp mô tả công việc, yêu cầu, quyền lợi.
- **Điền tin từ JD có sẵn:** NTD upload file JD (PDF/DOCX) → AI tự điền các trường của tin.
- NTD luôn xem lại và chỉnh sửa trước khi gửi duyệt.
- **[Đề xuất]** Miễn phí, tối đa **10 lần / ngày**.

### 8.2. Mức lương

| Kiểu | Nhập | Hiển thị |
|---|---|---|
| Khoảng lương | Tối thiểu và tối đa | "15 - 25 triệu" |
| Từ | Tối thiểu | "Từ 15 triệu" |
| Tới | Tối đa | "Tới 40 triệu" |
| Thỏa thuận | Không nhập số | "Thỏa thuận" |

- "Thỏa thuận": job có lương nhưng không công khai mức. Đơn vị VND, hiển thị theo triệu.
- Hiển thị trên thẻ tin và khối thông tin chung đầu trang chi tiết tin.

**Kiểm tra khi đăng tin:**
- Khoảng lương: tối đa > tối thiểu.
- Toàn thời gian: con số đã nhập không thấp hơn **lương tối thiểu vùng** của địa điểm làm việc.
- Bán thời gian: không thấp hơn lương tối thiểu vùng theo giờ.
- Thực tập: lớn hơn 0.
- Nhiều địa điểm: áp mức tối thiểu vùng cao nhất.
- Bảng lương tối thiểu vùng: Nghị định 293/2025/NĐ-CP (từ 01/01/2026); Admin cập nhật khi có điều chỉnh.

**Bộ lọc lương phía ứng viên:** Tất cả · Dưới 10 triệu · 10 - 15 triệu · 15 - 20 triệu · 20 - 25 triệu · 25 - 30 triệu · 30 - 50 triệu · Trên 50 triệu.

| Kiểu lương | Khớp khoảng lọc khi |
|---|---|
| Khoảng lương | Hai khoảng giao nhau |
| Từ X | Mức trên của khoảng lọc ≥ X |
| Tới X | Mức dưới của khoảng lọc ≤ X |
| Thỏa thuận | Chỉ hiện khi chọn "Tất cả" |

Tin "Thỏa thuận" không dùng tiêu chí lương khi gợi ý job và feedback CV cấp độ 3.

### 8.3. Hình thức nộp hồ sơ và câu hỏi sàng lọc
- **Chỉ nộp CV**, hoặc **Nộp CV + trả lời câu hỏi sàng lọc**.
- Tối thiểu **5 câu** và tối đa **30 câu**: Có/Không, trắc nghiệm, tự luận ngắn.
- NTD nhập **thời gian dự kiến** để hiển thị cho ứng viên.
- Câu Có/Không và trắc nghiệm có thể đặt **đáp án mong muốn** → hồ sơ không khớp được **gắn cờ "Không đáp ứng"**, không tự loại.
- Sửa câu hỏi khi đã có người nộp: hồ sơ cũ giữ câu hỏi tại thời điểm trả lời.

### 8.4. Loại tin và thời hạn hiển thị

| Loại tin | Cách có | Thời hạn hiển thị |
|---|---|---|
| **Tin cơ bản (miễn phí)** | Dùng **lượt đăng tin miễn phí**, cấp một lần khi lên **cấp 2/3**. **[Đề xuất]** 3 lượt | **[Đề xuất]** 14 ngày |
| **Tin Top (trả phí)** | Mua gói Top (mục 14) | **7 hoặc 14 ngày** tùy gói |

- Mỗi lượt đăng tin dùng một lần; tin hết hạn muốn chạy tiếp thì dùng lượt mới hoặc gói Top.
- Tin Top hiển thị ở vị trí ưu tiên (đầu danh sách, mục việc làm nổi bật, đề xuất job liên quan) tùy gói.

### 8.5. Trạng thái tin

| Trạng thái | Ý nghĩa |
|---|---|
| Nháp | Đang soạn |
| Chờ duyệt | Đã gửi, chờ Admin duyệt |
| Đang hiển thị | Đang nhận hồ sơ |
| Tạm dừng | Ẩn tạm thời, không nhận hồ sơ |
| Hết hạn | Hết thời hạn hiển thị hoặc quá hạn nộp |
| Bị từ chối | Không qua kiểm duyệt, kèm lý do |
| Bị ẩn | Gỡ do vi phạm hoặc tạm ẩn do báo cáo, kèm lý do |
| Đã đóng | NTD chủ động kết thúc |

Tin đóng hoặc hết hạn: hồ sơ chưa có kết quả chuyển sang **"Tin đã đóng"** phía ứng viên.

### 8.6. Kiểm duyệt
- **Mọi tin đều được Admin duyệt** trước khi hiển thị, trong **24 giờ làm việc**.
- **Duyệt tin nhanh:** dịch vụ trả phí; **[Đề xuất]** duyệt trong **2 giờ làm việc**.
- **AI quét trước** để hỗ trợ Admin: dấu hiệu lừa đảo, yêu cầu ứng viên nộp tiền/đặt cọc, yêu cầu phân biệt đối xử, mức lương bất thường. Tin bị AI gắn cờ được đưa lên đầu hàng chờ duyệt.
- **Sửa tin đang hiển thị** (vị trí, lương, yêu cầu, câu hỏi sàng lọc): duyệt lại; **bản cũ vẫn hiển thị** đến khi bản mới được duyệt.
- **Tự ẩn do báo cáo:** **3 báo cáo** từ 3 tài khoản ứng viên **đã xác thực** khác nhau trong **24 giờ** → tạm ẩn, chờ Admin.

### 8.7. Thao tác với tin
Xem trước, gửi duyệt, sửa, nhân bản, gia hạn, tạm dừng, mở lại, đóng.

---

## 9. Quản lý CV ứng tuyển

### 9.1. Danh sách hồ sơ
- Theo chiến dịch; lọc theo **trạng thái**; tìm theo **tên, email, số điện thoại** ứng viên; sắp xếp theo ngày nộp hoặc mức độ phù hợp.
- Hồ sơ gắn cờ "Không đáp ứng" được đánh dấu rõ.

### 9.2. Xem hồ sơ
- CV đã nộp (bản tại thời điểm nộp), câu trả lời sàng lọc, thông tin profile ứng viên cho phép hiển thị, thông tin liên hệ.
- Xem hồ sơ và thông tin liên hệ của ứng viên **đã ứng tuyển**: **miễn phí**, không tốn lượt.
- **Tải CV** (PDF).
- Lần đầu mở → phía ứng viên hiển thị **"Đã xem"** kèm thời điểm.
- Ứng viên đã xóa tài khoản: hiển thị **"Ứng viên đã xóa tài khoản"**, không còn xem được CV và liên hệ.

### 9.3. AI đánh giá CV
- Đối chiếu CV với yêu cầu tin: kỹ năng khớp, kỹ năng còn thiếu, kèm dẫn chứng trong CV.
- **Phân loại mức độ phù hợp:** Phù hợp cao / Phù hợp trung bình / Phù hợp thấp, dùng để sắp xếp và lọc.
- Miễn phí **20 hồ sơ đầu tiên mỗi tin**; vượt quá dùng **Credit**.
- AI **không tự loại** ứng viên. AI đang xử lý hoặc lỗi thì NTD vẫn xem hồ sơ bình thường.

### 9.4. Xử lý hồ sơ

| Trạng thái | Ai chuyển |
|---|---|
| Đã nộp | Hệ thống |
| Đã xem | Hệ thống |
| Đang xem xét | NTD |
| Phỏng vấn | NTD (kèm lịch phỏng vấn) |
| **Đã tuyển** | NTD — ứng viên nhận việc. Kết thúc |
| Không đạt | NTD. Kết thúc |
| Đã rút | Ứng viên. Kết thúc |
| Tin đã đóng | Hệ thống. Kết thúc |

- **Không đạt:** chọn lý do từ danh sách chuẩn (thiếu kinh nghiệm, kỹ năng chưa phù hợp, đã chọn ứng viên khác, vị trí đã tuyển đủ, khác); NTD chọn có chia sẻ cho ứng viên hay không.
- **Ghi chú nội bộ:** chỉ NTD xem.
- **Lưu hồ sơ ứng viên** tiềm năng.
- **Báo cáo ứng viên:** hồ sơ giả, spam, hành vi không phù hợp.

### 9.5. Nhắc xử lý và tỷ lệ phản hồi
- Hồ sơ Đã nộp / Đã xem quá **7 ngày** → nhắc NTD.
- **Tỷ lệ phản hồi** hiển thị trên tin (ví dụ *"Thường phản hồi trong 3 ngày"*): tính trên hồ sơ **30 ngày gần nhất**; "phản hồi" = chuyển khỏi Đã nộp / Đã xem trong **7 ngày**; chỉ hiển thị khi có từ **10 hồ sơ**.

### 9.6. Thời hạn giữ dữ liệu ứng viên
Sau khi chiến dịch đóng **12 tháng**, tự ẩn CV và thông tin liên hệ của ứng viên với NTD. *(Cần người làm pháp lý xác nhận.)*

---

## 10. CV đề xuất
- AI gợi ý ứng viên phù hợp với tin trong từng chiến dịch, kèm lý do phù hợp.
- Chỉ gợi ý ứng viên đã bật "Cho phép nhà tuyển dụng tìm thấy tôi" và không chặn công ty này.
- Điều kiện: NTD **cấp 2/3** trở lên.
- **Xem hồ sơ đầy đủ** của CV đề xuất tốn **1 lượt xem CV** (dùng chung với Tìm ứng viên). Xem lại hồ sơ đã mở không tốn thêm.

---

## 11. Tìm ứng viên (Tìm CV)

**Điều kiện:** NTD **cấp 2/3** trở lên.

- Tìm theo vị trí, cấp bậc, kỹ năng, kinh nghiệm, địa điểm, trạng thái tìm việc.
- Chỉ hiện ứng viên đã bật **"Cho phép nhà tuyển dụng tìm thấy tôi"** và **không chặn** công ty này.
- Kết quả hiển thị **tóm tắt profile**.
- **Xem hồ sơ đầy đủ** tốn **1 lượt xem CV**; hết lượt thì dùng **Credit**. Xem lại hồ sơ đã mở không tốn thêm.
- Thông tin liên hệ của ứng viên **vẫn ẩn** đến khi ứng viên chấp nhận lời mời chat (theo quy tắc quyền hiển thị phía ứng viên).
- Lưu hồ sơ ứng viên.
- Gửi lời mời chat (mục 13).

**Lượt xem CV:**
- Lên cấp 2/3: tặng **100 lượt**.
- Lên cấp 3/3: **[Đề xuất]** tặng thêm **100 lượt**.
- **[Đề xuất]** Lượt tặng có hạn sử dụng **12 tháng**.

---

## 12. Lịch phỏng vấn
- Tạo lịch cho hồ sơ: thời gian, múi giờ, hình thức (online/offline), địa điểm hoặc liên kết họp.
- Ứng viên xác nhận, từ chối hoặc đề nghị đổi lịch. NTD **chấp nhận** thời gian mới hoặc **đề xuất lại**; tối đa **2 lần đổi** mỗi lịch.
- Nhắc lịch trước **24 giờ** và **1 giờ**.

---

## 13. Chat với ứng viên (tương đương Top Connect)
- Chat realtime hai chiều qua **WebSocket**.

| Trường hợp | Phí |
|---|---|
| Ứng viên **đã ứng tuyển** vào tin của NTD | Miễn phí |
| Ứng viên **chưa ứng tuyển** (Tìm ứng viên, CV đề xuất) | Tốn **Credit**, gửi dưới dạng **lời mời** |

- Tối đa **1 lời mời / ứng viên / 15 ngày**; ứng viên từ chối thì 15 ngày sau mới mời lại.
- Ứng viên **chấp nhận** lời mời thì cuộc trò chuyện mới mở và thông tin liên hệ mới hiển thị.
- **[Đề xuất]** Ứng viên từ chối hoặc không phản hồi trong 7 ngày: hoàn Credit.

---

## 14. Dịch vụ, Credit và Thanh toán

### 14.1. Danh mục dịch vụ

| Nhóm | Dịch vụ | Ghi chú |
|---|---|---|
| **Gói Trial** | Gói đăng tin Top dùng thử | Mỗi NTD **chỉ mua và kích hoạt 1 gói Trial** |
| **Gói Top (đăng tin hiệu suất cao)** | Nhiều hạng gói, khác nhau ở vị trí hiển thị và thời hạn **7 / 14 ngày** | Tên và số hạng gói: *(Đang cập nhật)* |
| **Add-on (dịch vụ cộng thêm)** | Nhãn **Gấp**, nhãn **Hot**, tô màu tiêu đề, đẩy tin lên đầu, **duyệt tin nhanh** | Chỉ áp dụng cho **tin đang chạy gói Top**; riêng duyệt tin nhanh áp dụng cho mọi tin |
| **Credit** | Mua gói Credit | Dùng cho: xem CV khi hết lượt, lời mời chat, AI đánh giá CV vượt mức miễn phí |

- Giá: *(Đang cập nhật)*. **Giá chưa bao gồm VAT.**
- Không làm: banner thương hiệu, trang tuyển dụng riêng, API đồng bộ CV, điểm thưởng / đổi quà.

### 14.2. Credit
- Đơn vị quy đổi nội bộ của InterVue; mua theo gói.
- Có **thời hạn sử dụng**: **[Đề xuất]** 12 tháng kể từ ngày mua.
- Không quy đổi lại thành tiền, không chuyển nhượng.
- Mức Credit cho từng tiện ích: *(Đang cập nhật)*.

### 14.3. Mua dịch vụ
- **Thêm vào giỏ** hoặc **Mua ngay**.
- Thanh toán chuyển khoản qua **SePay** (luồng giống tài liệu Ứng viên, mục 5.19).
- Cảnh báo cố định đầu trang: *"Nhằm tránh rủi ro mạo danh và lừa đảo, InterVue chỉ nhận thanh toán qua mã QR trên hệ thống. Không chuyển khoản vào bất kỳ tài khoản cá nhân nào."*
- **Yêu cầu xuất hóa đơn VAT:** gửi kèm thông tin xuất hóa đơn; Admin xử lý thủ công.

### 14.4. Dịch vụ của tôi
- Thanh toán thành công → dịch vụ chuyển vào **"Dịch vụ của tôi"**; Credit cộng vào tài khoản.
- Dịch vụ thuộc về **tài khoản NTD** đã mua.
- NTD **kích hoạt bất cứ lúc nào**: chọn tin cần áp dụng → kích hoạt.

| Trạng thái dịch vụ | Ý nghĩa |
|---|---|
| Chưa kích hoạt | Đã mua, chưa áp dụng |
| Đang chạy | Đang áp dụng cho tin, hiển thị thời hạn còn lại |
| Hết hạn | Hết thời gian áp dụng |

### 14.5. Hoàn tiền
- **Dịch vụ đã mua không được hoàn tiền.**
- Ngoại lệ: lỗi kỹ thuật từ hệ thống khiến không sử dụng được dịch vụ → NTD gửi yêu cầu hỗ trợ; Admin xử lý theo từng trường hợp.
- AI lỗi: không trừ lượt / tự hoàn Credit (theo quy tắc chung cho AI).

---

## 15. Nhật ký hoạt động

| Nhóm | Ví dụ |
|---|---|
| Tất cả lịch sử | |
| Lịch sử kích hoạt dịch vụ | Mua, kích hoạt, hết hạn dịch vụ |
| Lịch sử Credit | Cộng, trừ, hết hạn Credit |
| Lịch sử cập nhật tài khoản | Đăng nhập, đăng xuất, đổi mật khẩu, 2FA, xác thực số điện thoại, cập nhật thông tin công ty, gửi giấy phép |
| Chiến dịch & tin tuyển dụng | Tạo chiến dịch, gửi duyệt, đăng, sửa, đóng tin |
| **Báo cáo CV tìm kiếm** | Các hồ sơ đã mở từ Tìm ứng viên, thời điểm, lượt/Credit đã dùng |
| **Báo cáo CV đề xuất** | Các hồ sơ đã mở từ CV đề xuất, thời điểm, lượt/Credit đã dùng |

- Lọc theo khoảng thời gian, mặc định **30 ngày gần nhất**.
- Chỉ xem, không sửa, không xóa.

---

## 16. Báo cáo tuyển dụng

Lọc theo chiến dịch và khoảng thời gian:
- **Phễu tuyển dụng:** lượt xem tin → ứng tuyển → phỏng vấn → đã tuyển; tỷ lệ chuyển đổi giữa các bước.
- Hồ sơ theo trạng thái và theo mức độ phù hợp (AI); thời gian xử lý trung bình.
- Nguồn ứng viên: tự ứng tuyển / lời mời / CV đề xuất.
- Hiệu quả dịch vụ: lượt xem tin trước và sau khi kích hoạt dịch vụ.
- Tỷ lệ phản hồi.

---

## 17. Thông báo

| Sự kiện | Trong ứng dụng | Email |
|---|---|---|
| Xác minh email, đặt lại mật khẩu | | ✓ |
| Đổi mật khẩu, đổi email, bật/tắt 2FA, liên kết mạng xã hội | ✓ | ✓ |
| Lên cấp xác thực; kết quả duyệt giấy phép, quyền đại diện, yêu cầu sửa thông tin công ty | ✓ | ✓ |
| Kết quả duyệt Thỏa thuận dữ liệu (mẫu riêng) | ✓ | ✓ |
| Tin được duyệt / bị từ chối / bị ẩn | ✓ | ✓ |
| Tin sắp hết hạn (trước 3 ngày) | ✓ | ✓ |
| Hồ sơ ứng tuyển mới | ✓ | |
| Ứng viên rút hồ sơ | ✓ | |
| Hồ sơ chưa xử lý quá 7 ngày | ✓ | ✓ |
| Ứng viên phản hồi lịch phỏng vấn; nhắc lịch (24 giờ, 1 giờ) | ✓ | ✓ |
| Ứng viên chấp nhận / từ chối lời mời chat; tin nhắn mới | ✓ | |
| Thanh toán thành công; dịch vụ, Credit, lượt xem CV sắp hết hạn | ✓ | ✓ |
| Phản hồi yêu cầu hỗ trợ, báo giá, báo cáo | ✓ | ✓ |
| Yêu cầu xóa tài khoản, khôi phục tài khoản | | ✓ |

---

## 18. Cài đặt tài khoản
- Đổi mật khẩu
- Thông tin tài khoản (cấp xác thực, các bước nâng cấp)
- Giấy đăng ký doanh nghiệp / hộ kinh doanh
- Văn bản xử lý dữ liệu cá nhân
- Thông tin công ty
- Nhu cầu tuyển dụng
- Bảo mật (2FA, mã khôi phục, thiết bị, liên kết mạng xã hội)
- Cài đặt thông báo

---

## 19. Hỗ trợ & Xóa tài khoản

**Gửi yêu cầu hỗ trợ:** lỗi xác thực, mất quyền truy cập, mất 2FA, yêu cầu sửa thông tin công ty, khiếu nại kiểm duyệt, lỗi dịch vụ.

**Xóa tài khoản:** không ảnh hưởng tài khoản ứng viên cùng email. Thông tin công ty **không bị xóa** (có thể có NTD khác đang dùng).

*Bước 1 — Yêu cầu xóa*
- Hiển thị ảnh hưởng: chiến dịch và tin đang mở, hồ sơ chưa xử lý, dịch vụ / Credit / lượt còn lại.
- Xác nhận bằng **mã gửi về email**.

*Chặn xóa tạm thời* khi còn: giao dịch đang xử lý; khiếu nại đang mở; tin đang bị báo cáo vi phạm / lừa đảo chưa xử lý xong.

*Cảnh báo, không chặn* khi còn dịch vụ, Credit, lượt chưa dùng: sẽ mất toàn bộ, không hoàn tiền.

*Bước 2 — 7 ngày chờ*
- Tin tạm dừng và bị ẩn khỏi tìm kiếm.
- Đăng nhập lại trong 7 ngày → khôi phục; tin giữ trạng thái tạm dừng.

*Bước 3 — Hết 7 ngày*
- Đóng và xóa chiến dịch, tin, kèm CV và câu trả lời của ứng viên đã nộp. Ứng viên nhận thông báo: *"Tin tuyển dụng đã đóng do nhà tuyển dụng ngừng hoạt động."*
- Xóa tài khoản, thông tin cá nhân, chat, ghi chú nội bộ.
- **Giữ lại:** chứng từ giao dịch theo quy định kế toán, thuế; hồ sơ xử lý vi phạm.

---

## 20. Phụ thuộc vào vai trò khác

| Chức năng NTD | Cần phía | Nội dung |
|---|---|---|
| Nhu cầu tuyển dụng, Báo giá dịch vụ | Admin | Hàng chờ tư vấn / báo giá |
| Thỏa thuận dữ liệu mẫu riêng | Admin | Duyệt văn bản |
| Giấy phép, quyền đại diện, sửa thông tin công ty | Admin | Duyệt / từ chối / yêu cầu bổ sung |
| Duyệt tin, duyệt tin nhanh, tin bị báo cáo | Admin | Hàng chờ duyệt, xử lý tin tạm ẩn |
| Lương tối thiểu vùng, danh mục | Admin | Cập nhật bảng lương, danh mục vị trí, cấp bậc, kỹ năng, địa điểm |
| Gói dịch vụ, Credit | Admin | Cấu hình gói, giá, mức Credit cho từng tiện ích |
| Hóa đơn VAT, hoàn tiền do lỗi hệ thống | Admin | Xử lý thủ công |
| Báo cáo ứng viên | Admin | Tiếp nhận, xử lý |
| Ứng tuyển, cho phép tìm thấy, chặn doanh nghiệp, trạng thái "Đã tuyển" | Candidate | Đã có trong tài liệu Ứng viên |

---

## 21. Mục còn chờ chốt
- Nhà cung cấp OTP Zalo / SMS; nguồn tra cứu mã số thuế.
- Nội dung mẫu Thỏa thuận xử lý dữ liệu cá nhân; thời hạn giữ dữ liệu 12 tháng; lương tối thiểu cho job thực tập (cần người làm pháp lý).
- Tên, số hạng, giá các gói Top, Trial, Add-on, Credit; mức Credit cho từng tiện ích.
- Các mục **[Đề xuất]**: điều kiện cấp 3/3, số lượt và thời hạn tin miễn phí, thời gian duyệt tin nhanh, giới hạn AI soạn tin, hạn dùng lượt xem CV và Credit, hoàn Credit khi lời mời bị từ chối.
