# InterVue — Đặc tả chức năng: Ứng viên (Candidate)

**Phiên bản 1.1 · 07/10/2026**

Tài khoản Ứng viên và tài khoản Nhà tuyển dụng là **hai tài khoản tách biệt**. Cùng một email được phép đăng ký ở cả hai cổng, nhưng mỗi cổng đăng ký, đăng nhập và quản lý thông tin riêng (mật khẩu, profile, xác thực, gói dịch vụ, lịch sử giao dịch). Tài liệu này chỉ mô tả chức năng của tài khoản Ứng viên.

Chỉ **doanh nghiệp** và **hộ kinh doanh** được đăng tin tuyển dụng trên InterVue; không có nhà tuyển dụng cá nhân.

**Thuật ngữ:**
- **Job:** công việc mà doanh nghiệp cần tuyển người.
- **Tin tuyển dụng:** bài đăng giới thiệu một job.
- **Mọi job đều có lương.** Không có job không lương.

**Danh mục dùng chung với phía Nhà tuyển dụng** (để gợi ý, tìm kiếm và đối chiếu khớp nhau):
- **Vị trí chuyên môn:** danh mục vị trí IT chuẩn hóa (Backend, Frontend, Fullstack, Mobile, DevOps, QA/Tester, Data, AI/ML, …).
- **Cấp bậc:** Thực tập sinh, Fresher, Junior, Middle, Senior, Lead, Manager.
- **Kỹ năng:** danh mục kỹ năng chuẩn hóa.
- **Địa điểm:** danh mục đơn vị hành chính mới, hai cấp **Tỉnh/Thành phố → Phường/Xã**.

---

## 1. Chức năng công khai (không cần đăng nhập)

### 1.1. Tìm kiếm (Hero section)
Tìm theo vị trí tuyển dụng hoặc tên công ty, kèm địa điểm.

### 1.2. Xem chi tiết tin tuyển dụng
Xem nội dung tin. Các nút "Kiểm tra độ phù hợp", "Luyện phỏng vấn cho tin này", "Lưu job", "Ứng tuyển" yêu cầu đăng nhập.

### 1.3. Job gần bạn
- Hiển thị tin tuyển dụng theo khoảng cách, trên bản đồ.
- Dùng vị trí hiện tại (khi người dùng cho phép truy cập định vị) hoặc địa chỉ người dùng nhập.
- Bán kính: 5 / 10 / 20 / 50 km, mặc định **10 km**.

### 1.4. Trang công ty
- Thông tin công ty: tên, logo, giới thiệu, website, địa chỉ.
- Nhãn xác minh doanh nghiệp.
- Danh sách tin đang tuyển của công ty.

### 1.5. Công ty nổi bật
Hiển thị trên trang chủ.

### 1.6. Chatbot hướng dẫn sử dụng
- Dữ liệu từ tài liệu hướng dẫn, áp dụng kỹ thuật **RAG**.
- Chỉ trả lời về cách sử dụng InterVue. Từ chối câu hỏi ngoài phạm vi và các câu tìm cách khiến chatbot bỏ qua hướng dẫn.
- Giới hạn:

| Người dùng | Giới hạn |
|---|---|
| Khách chưa đăng nhập | 10 câu hỏi / giờ (theo IP) |
| Đã đăng nhập | 30 câu hỏi / ngày |

### 1.7. Trang nội dung
Câu hỏi thường gặp (FAQ), Blog.

---

## 2. Đăng ký

**Phương thức đăng ký:**
- Google
- Facebook
- GitHub
- LinkedIn
- Email (form đăng ký)

**Đăng ký bằng form email** gồm các trường:
- Họ và tên
- Email
- Mật khẩu
- Nhập lại mật khẩu
- Checkbox đồng ý với Chính sách & Điều khoản
- Checkbox *"Tôi xác nhận đủ 16 tuổi"*

**Độ tuổi tối thiểu:** 16 tuổi. Được kiểm tra lại bằng ngày sinh trên CCCD khi eKYC (mục 5.9).

**Xác minh email** (áp dụng cho đăng ký bằng form):
- Sau khi đăng ký, hệ thống gửi email xác minh.
- Liên kết xác minh hết hạn sau **24 giờ** và chỉ dùng được một lần.
- Gửi lại: chờ 60 giây giữa các lần, tối đa 3 lần / 15 phút.
- Chưa xác minh email: vẫn đăng nhập và xem được, nhưng **không được thực hiện eKYC**.

**Đăng ký / đăng nhập bằng mạng xã hội:**
- Hệ thống lấy email từ tài khoản mạng xã hội. Nếu mạng xã hội không trả về email, hệ thống báo lỗi và hướng dẫn dùng phương thức khác.
- Lần đầu xác thực thành công, hệ thống hiển thị bảng Chính sách & Điều khoản và xác nhận đủ 16 tuổi. Người dùng chỉ vào được hệ thống sau khi bấm **Đồng ý**.
- Hệ thống gửi mật khẩu mặc định (sinh ngẫu nhiên, tuân theo quy tắc mật khẩu) về email của người dùng. Người dùng có thể đổi mật khẩu khi cần.
- **Email trùng với tài khoản ứng viên đã có:** tự động liên kết mạng xã hội vào tài khoản đó, không cần nhập mật khẩu, với điều kiện:
  - Mạng xã hội xác nhận email **đã được xác minh**.
  - Hệ thống gửi email thông báo: *"Tài khoản của bạn vừa được liên kết với [tên mạng xã hội]."*

**Quy tắc mật khẩu:**
- Tối thiểu 8 ký tự.
- Có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt.
- Không được trùng với địa chỉ email.

**Kiểm tra email:** email là duy nhất trong các **tài khoản ứng viên**. Email đã dùng cho tài khoản nhà tuyển dụng vẫn đăng ký được tài khoản ứng viên, và hai tài khoản hoạt động độc lập.

---

## 3. Đăng nhập

- Đăng nhập bằng email + mật khẩu, hoặc bằng mạng xã hội.
- Nhập sai quá **3 lần** → yêu cầu **CAPTCHA** cho các lần tiếp theo. Không khóa tài khoản.
  - Đếm số lần sai theo **cả tài khoản và IP**.
  - Bộ đếm được reset khi đăng nhập thành công.
- Thông báo lỗi chung: *"Thông tin đăng nhập không chính xác"*. Không tiết lộ tài khoản có tồn tại hay mật khẩu bị sai.
- **2FA:** nếu đã bật, áp dụng cho cả đăng nhập bằng email và mạng xã hội.
  - Luồng: xác thực mật khẩu hoặc mạng xã hội → nhập mã 2FA → vào hệ thống.

---

## 4. Quên mật khẩu

- Người dùng nhập địa chỉ email.
- Email được gửi qua **worker (queue)** để không chặn luồng xử lý chính.
- Thông báo: *"Nếu email tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu trong vòng 5 phút."*

| Quy tắc | Giá trị |
|---|---|
| Thời hạn liên kết | 15 phút, dùng một lần |
| Liên kết mới | Làm vô hiệu liên kết cũ |
| Thời gian chờ trước khi gửi lại | 60 giây |
| Số lần gửi tối đa | 3 lần / 15 phút, tính theo cả email và IP |
| Sau khi đặt lại thành công | Đăng xuất khỏi mọi thiết bị |

---

## 5. Chức năng cần đăng nhập

### 5.1. Onboarding sau đăng ký

Hướng dẫn người dùng mới qua các bước:
1. Upload CV.
2. AI điền profile từ CV, người dùng xem lại và xác nhận.
3. Xác nhận vị trí mong muốn.
4. Bật Job alert.

Cho phép bỏ qua từng bước và quay lại sau.

### 5.2. Dashboard ứng viên (chỉ ứng viên xem được)

**Tổng quan:**
- Số hồ sơ theo từng trạng thái.
- Lịch phỏng vấn sắp tới.
- Gợi ý job mới.
- Số lượt feedback CV còn lại trong ngày.
- % hoàn thiện profile, kèm gợi ý phần còn thiếu.

**Kết quả AI:**
- Điểm mạnh và gợi ý cải thiện từ lần feedback CV gần nhất.
- Số buổi đã luyện phỏng vấn tự động.

**Hiệu quả hồ sơ trong tuần:**
- Lượt nhà tuyển dụng xem hồ sơ.
- Lượt xuất hiện trong tìm kiếm của nhà tuyển dụng.
- Số lời mời phỏng vấn.
- Lượt nhà tuyển dụng lưu hồ sơ.

### 5.3. Hồ sơ cá nhân (Profile)

#### Thông tin cá nhân
- Ảnh đại diện, ảnh bìa.
- Họ và tên, chức danh nghề nghiệp.
- Trạng thái tìm việc: **Đang tìm việc / Mở cơ hội / Tắt tìm việc**.
- Email liên hệ (mặc định là email đăng nhập, được đổi), số điện thoại, địa điểm sinh sống.
- Năm sinh, giới tính: **không bắt buộc**.
- Liên kết: Portfolio / Website cá nhân, GitHub, LinkedIn.

#### Giới thiệu bản thân
Mô tả kinh nghiệm, thế mạnh và định hướng nghề nghiệp.

#### Kinh nghiệm làm việc
Thêm nhiều nơi làm việc, mỗi nơi gồm:
- Chức danh, tên công ty, địa điểm làm việc.
- Thời gian bắt đầu – kết thúc, hoặc đánh dấu "Đang làm việc tại đây".
- Mô tả công việc, thành tích nổi bật, kỹ năng sử dụng.
- Logo công ty: tự hiển thị nếu công ty có trang trên InterVue.

#### Kỹ năng chuyên môn
- Mỗi kỹ năng gồm: tên kỹ năng, nhóm kỹ năng (Kỹ năng cốt lõi / AI & Dữ liệu / Công cụ & DevOps / Kỹ năng mềm), mức độ thành thạo (Cơ bản / Khá / Thành thạo / Chuyên gia), số năm kinh nghiệm.
- Tên kỹ năng được **chọn từ danh mục kỹ năng chuẩn hóa** (gợi ý khi gõ), áp dụng cho cả kỹ năng trong kinh nghiệm và dự án.

#### Dự án tiêu biểu
Thêm nhiều dự án, mỗi dự án gồm:
- Tên dự án, vai trò, thời gian thực hiện.
- Mô tả dự án, kết quả / điểm nổi bật, công nghệ áp dụng.
- Link GitHub, link Demo / Website.

#### Học vấn & Bằng cấp
Thêm nhiều trường, mỗi trường gồm: tên trường, bằng cấp, chuyên ngành, niên khóa, GPA, giải thưởng / thành tích.

#### Chứng chỉ & Ngoại ngữ
- **Ngoại ngữ:** tên ngoại ngữ, mức độ sử dụng, chứng chỉ ngoại ngữ (ví dụ IELTS 7.5).
- **Chứng chỉ:** ứng viên upload ảnh chứng chỉ, trong đó bao gồm: đơn vị cấp, ngày cấp, mã chứng chỉ, link xác thực online.

#### Kỳ vọng công việc
- Vị trí mong muốn (**bắt buộc**), chọn từ danh mục vị trí chuẩn hóa.
- Cấp bậc mong muốn: Thực tập sinh / Fresher / Junior / Middle / Senior / Lead / Manager.
- Mức lương mong muốn: khoảng từ – đến, hoặc thỏa thuận.
- Hình thức làm việc: On-site / Hybrid / Remote / Linh hoạt.
- Loại hợp đồng: Toàn thời gian / Bán thời gian / Thực tập.
- Địa điểm mong muốn (chọn nhiều, theo danh mục Tỉnh/Thành phố).
- Ngành nghề quan tâm (chọn nhiều).

#### AI cập nhật profile từ CV
- Profile còn trống: AI điền toàn bộ, người dùng xem lại và xác nhận.
- Profile đã có dữ liệu: AI hiển thị từng phần đề xuất thay đổi (cũ → mới). Người dùng chọn phần muốn cập nhật; không tự ghi đè.
- CV không đọc được: hiển thị lý do, người dùng nhập thủ công.

#### Quyền hiển thị thông tin
- Năm sinh, giới tính: **mặc định ẩn** với nhà tuyển dụng; ứng viên tự chọn hiển thị. AI không dùng hai thông tin này để đánh giá.
- Email liên hệ, số điện thoại: chỉ hiển thị cho nhà tuyển dụng của **tin ứng viên đã nộp hồ sơ**, hoặc sau khi ứng viên chấp nhận lời mời chat.
- Công tắc **"Cho phép nhà tuyển dụng tìm thấy tôi"**.

### 5.4. Quản lý CV

- Chỉ chấp nhận file **PDF**, tối đa **5 MB**, tối đa **5 trang**. Từ chối file PDF có mật khẩu.
- Đặt tên CV, chọn CV mặc định, xóa CV.
- Số CV tối đa theo gói:

| Gói | Số CV |
|---|---|
| Thường | 3 |
| Education | 5 |
| Pro | 10 |
| Premium | 20 |

- Hồ sơ ứng tuyển giữ **bản CV tại thời điểm nộp**. Xóa CV trong tài khoản không làm mất bản đã nộp, và bản đã nộp không tính vào số CV tối đa.
- CV không công khai. Chỉ ứng viên và nhà tuyển dụng của tin đã nộp mới xem, tải được.
- *Chưa làm tính năng tạo/chỉnh sửa CV trên hệ thống; làm upload và quản lý CV trước.*

### 5.5. Lưu job
Lưu job để xem lại sau.

### 5.6. Gợi ý job bằng AI
- Gợi ý tin tuyển dụng dựa trên profile (vị trí mong muốn, kỹ năng, kinh nghiệm, địa điểm) và CV.
- Mỗi gợi ý kèm **lý do phù hợp**, ví dụ: *"Khớp 4/5 kỹ năng yêu cầu: Laravel, MySQL, REST API, Git."*
- Hiển thị trên trang chủ và Dashboard sau khi đăng nhập.
- Profile còn trống: hiển thị tin mới nhất, kèm nhắc hoàn thiện profile.

### 5.7. Job alert
- Ứng viên tạo thông báo theo **vị trí và địa điểm**.
- Chọn tần suất nhận: hằng ngày hoặc hằng tuần.
- Email gửi qua **worker (queue)**.
- Mỗi email có liên kết **hủy nhận thông báo** bằng một lần bấm.

### 5.8. Theo dõi công ty
- Theo dõi / bỏ theo dõi công ty từ trang công ty.
- Nhận thông báo khi công ty đang theo dõi đăng tin mới.

### 5.9. Xác thực danh tính (eKYC)

**Thực hiện qua FPT.AI.** Điều kiện: email đã xác minh.

**Các bước:**
- Chụp CCCD mặt trước
- Chụp CCCD mặt sau
- Xác thực khuôn mặt (liveness)

**Quy tắc duyệt:**

| Kết quả | Xử lý |
|---|---|
| Tất cả các điểm đánh giá (đọc CCCD, khớp khuôn mặt, liveness) **≥ 80%** | Tự động duyệt |
| Có điểm trong khoảng **> 50% và < 80%** | Chuyển Admin duyệt |
| Có bất kỳ điểm nào **≤ 50%** | Tự động từ chối, hiển thị lý do |
| Số CCCD đã gắn với tài khoản ứng viên khác | Chuyển Admin xử lý, không tự động duyệt |
| Ngày sinh trên CCCD cho thấy **dưới 16 tuổi** | Tự động từ chối, hiển thị lý do |

- Duyệt thành công → tài khoản chuyển sang trạng thái **Đã xác thực**.
- Khi chuyển Admin duyệt: hiển thị trạng thái **"Đang chờ duyệt"**, thời gian xử lý dự kiến **trong 24 giờ làm việc**.

**Làm lại khi bị từ chối:**
- Tối đa **5 lần** (tổng cộng, không tự reset).
- Mỗi lần bị từ chối hiển thị lý do cụ thể để người dùng chụp lại đúng.
- Chỉ tính các lần FPT.AI trả kết quả bị từ chối. Không tính lỗi kỹ thuật và các lần chuyển Admin duyệt.
- Sau lần thứ 5: khóa tự làm eKYC, hiển thị nút **"Gửi yêu cầu xét duyệt thủ công"**. Admin xem xét và chọn:
  - Duyệt
  - Cấp thêm lượt làm lại
  - Từ chối, đánh dấu nghi ngờ gian lận
- Dùng nhiều số CCCD khác nhau qua các lần thử → chuyển Admin xử lý ngay.

### 5.10. Quản lý tài khoản

| Chức năng | Quy tắc |
|---|---|
| Đăng xuất | Đăng xuất trên thiết bị hiện tại |
| Quản lý thiết bị | Xem danh sách thiết bị đang đăng nhập (trình duyệt, hệ điều hành, thời gian đăng nhập gần nhất). Đăng xuất từng thiết bị hoặc **đăng xuất khỏi mọi thiết bị** |
| Liên kết mạng xã hội | Xem, thêm, gỡ liên kết |
| Đổi mật khẩu | Nhập mật khẩu hiện tại. Quên mật khẩu hiện tại thì dùng chức năng Quên mật khẩu. Đổi xong đăng xuất các thiết bị khác |
| Đổi email | Nhập mật khẩu → gửi liên kết xác minh đến **email mới** → xác minh xong mới thay thế. Gửi thông báo đến **email cũ** |

**Xác thực hai lớp (2FA):**

| Chức năng | Quy tắc |
|---|---|
| Hình thức | Google Authenticator hoặc Email |
| Bật 2FA | Google Authenticator: quét mã QR, nhập mã để xác nhận. Email: nhập mã gửi về email |
| Tắt 2FA | Nhập mã 2FA hiện tại hoặc một mã khôi phục |
| Mã 2FA qua email | 6 chữ số, hết hạn sau **5 phút**, nhập sai **5 lần** thì mã bị hủy |
| Mã khôi phục | Cấp **10 mã** khi bật 2FA, chỉ hiển thị một lần, mỗi mã dùng một lần. Có thể tạo bộ mã mới, bộ cũ bị vô hiệu |
| Mất phương thức 2FA | Dùng mã khôi phục, hoặc gửi yêu cầu hỗ trợ |

### 5.11. Đánh giá & Feedback CV

| Cấp độ | Tên | Mốc so sánh | Truy cập | Giới hạn |
|---|---|---|---|---|
| **Cấp độ 1** | Đánh giá CV tổng quát | CV tiêu chuẩn, không có mục tiêu. Cần nghiên cứu để xây dựng bộ quy định chung trước | Trang Feedback CV | Gộp chung với cấp độ 2: **3 lần / ngày** |
| **Cấp độ 2** | Đánh giá theo vị trí mong muốn | Vị trí muốn ứng tuyển trong profile | Trang Feedback CV | (như trên) |
| **Cấp độ 3** | Kiểm tra độ phù hợp với tin | Một tin tuyển dụng cụ thể | Nút **"Kiểm tra độ phù hợp"** trên trang chi tiết tin | **Có tính phí** |

**Tiêu chí đánh giá:**

*Cấp độ 1 — Đánh giá CV tổng quát*
- Hệ thống đọc được file CV (không phải ảnh scan, bố cục không quá phức tạp).
- Có đủ các phần cốt lõi: thông tin liên hệ, kinh nghiệm/dự án, kỹ năng, học vấn, chứng chỉ.
- Mô tả kinh nghiệm nêu rõ: làm gì, bằng công nghệ gì, đạt kết quả gì.
- Dự án nhóm nêu rõ vai trò của bản thân.
- Kỹ năng liệt kê có bằng chứng sử dụng trong dự án/kinh nghiệm.
- Mốc thời gian nhất quán; chính tả, ngữ pháp.

*Cấp độ 2 — Đánh giá theo vị trí mong muốn* (gồm toàn bộ cấp độ 1, cộng thêm)
- Kỹ năng thường cần cho vị trí: đã có bằng chứng / còn thiếu.
- Phần liên quan nhất đến vị trí có được trình bày nổi bật không.
- Cách mô tả có tương xứng với cấp bậc đang nhắm (Thực tập sinh, Fresher, Junior, Middle, Senior, Lead, Manager).

*Cấp độ 3 — Kiểm tra độ phù hợp với tin* (gồm toàn bộ cấp độ 1, cộng thêm)
- Đối chiếu từng yêu cầu của tin: CV đáp ứng / chưa có bằng chứng.
- Gợi ý phần nên bổ sung hoặc nhấn mạnh cho tin này.

**Nguyên tắc chung:**
- Mỗi nhận xét gồm: đoạn trong CV → vấn đề → cách sửa.
- AI không gợi ý thêm kinh nghiệm, kỹ năng không có thật.
- Không dùng tuổi, giới tính, ảnh, quê quán, trường học hay dữ liệu KYC để đánh giá.
- Kết quả feedback chỉ ứng viên xem được.

**Quy tắc sử dụng:**
- Giới hạn 3 lần/ngày reset lúc **00:00 giờ Việt Nam**, áp dụng cho gói Thường. Các gói khác: *(Đang cập nhật)*.
- Cùng một CV không thay đổi → trả lại kết quả cũ, **không tính lượt**.
- Profile chưa khai vị trí mong muốn → chỉ chạy cấp độ 1, kèm nhắc người dùng khai vị trí.

### 5.12. Phỏng vấn tự động

| Thành phần | Mô tả |
|---|---|
| Điểm truy cập | Trang Phỏng vấn tự động: chọn CV, luyện theo vị trí mong muốn trong profile. Trang chi tiết tin: nút "Luyện phỏng vấn cho tin này", câu hỏi dựa trên yêu cầu kỹ thuật của tin kết hợp CV |
| Hình thức | Văn bản (giọng nói làm sau) |
| Số câu | 5–10 câu mỗi buổi. Mỗi câu AI được hỏi lại tối đa 1 lần nếu trả lời chưa rõ |
| Luồng | Chọn CV và mục tiêu → AI sinh câu hỏi → trả lời từng câu → feedback từng câu → tổng kết cuối buổi |
| Feedback từng câu | Độ chính xác kỹ thuật, độ sâu, cách trình bày, gợi ý cách trả lời tốt hơn |
| Tổng kết | 3 điểm mạnh, 3 điểm cần cải thiện |
| Lịch sử | Xem lại các buổi đã luyện |
| Giới hạn / phí | *(Đang cập nhật)* |

**Nguyên tắc:**
- Kết quả **chỉ ứng viên xem được**, không gửi cho nhà tuyển dụng.
- AI **không đọc** câu hỏi sàng lọc và bài đánh giá thật của tin tuyển dụng.

### 5.13. Ứng tuyển

**Điều kiện:**
- Tài khoản ở trạng thái **Đã xác thực**.
- Tin còn hạn và đang nhận hồ sơ. Tin đã hết hạn hoặc tạm dừng thì không nộp được.

**Hình thức nộp hồ sơ** (do nhà tuyển dụng chọn khi tạo tin):
- Nộp CV
- Nộp CV + trả lời câu hỏi sàng lọc (trắc nghiệm, tự luận ngắn)

**Câu hỏi sàng lọc:**
- Số lượng câu hỏi tuỳ thuộc bản tin.
- Hiển thị **số câu và thời gian dự kiến** trước khi bắt đầu.
- **Tự động lưu nháp**. Nháp được giữ đến khi nộp hoặc khi tin hết hạn.
- Xem lại toàn bộ câu trả lời trước khi nộp.

**Quy tắc:**
- Mỗi tin chỉ có một hồ sơ đang hoạt động của mỗi ứng viên.
- Không được ứng tuyển vào tin của doanh nghiệp mà **email tài khoản ứng viên trùng với email tài khoản nhà tuyển dụng** đã đăng tin đó.
- Rút hồ sơ xong vẫn được nộp lại. Khi nộp lại, **giữ nguyên câu trả lời câu hỏi sàng lọc của lần nộp đầu tiên**; ứng viên chỉ được đổi CV.

**Trạng thái hồ sơ ứng tuyển:**

| Trạng thái | Ai chuyển | Ghi chú |
|---|---|---|
| **Đã nộp** | Hệ thống | Khi nộp thành công |
| **Đã xem** | Hệ thống | Khi nhà tuyển dụng mở hồ sơ lần đầu |
| **Đang xem xét** | Nhà tuyển dụng | |
| **Phỏng vấn** | Nhà tuyển dụng | Đi kèm lịch phỏng vấn |
| **Đã tuyển** | Nhà tuyển dụng | Ứng viên nhận việc. Trạng thái kết thúc |
| **Không đạt** | Nhà tuyển dụng | Trạng thái kết thúc |
| **Đã rút** | Ứng viên | Trạng thái kết thúc |
| **Tin đã đóng** | Hệ thống | Tin đóng khi hồ sơ chưa có kết quả |

**Quản lý hồ sơ đã nộp:**
- Danh sách hồ sơ đã nộp, lọc theo trạng thái.
- **Timeline** từng hồ sơ: các mốc trạng thái theo thời gian.
- **Nhà tuyển dụng đã xem hồ sơ:** hiển thị trạng thái "Đã xem" và thời điểm nhà tuyển dụng mở hồ sơ.
- **Rút hồ sơ:** được rút khi hồ sơ chưa ở trạng thái kết thúc.

### 5.14. Lịch phỏng vấn
- Nhà tuyển dụng tạo lịch phỏng vấn cho hồ sơ ứng tuyển, gồm: thời gian, múi giờ, hình thức (online/offline), địa điểm hoặc liên kết họp.
- Ứng viên **xác nhận**, **từ chối** hoặc **đề nghị đổi lịch**.
- Thêm lịch vào **Google Calendar**.
- Nhắc lịch trước **24 giờ** và **1 giờ**.

### 5.15. Chat với nhà tuyển dụng
- Chat realtime qua **WebSocket**.
- Ứng viên **không phải trả phí** để chat với nhà tuyển dụng.
- Chặn và báo cáo cuộc trò chuyện.
- Tin nhắn từ nhà tuyển dụng mà ứng viên **chưa ứng tuyển** hiển thị dạng **lời mời**. Ứng viên chấp nhận thì cuộc trò chuyện mới được mở.
- Mỗi nhà tuyển dụng gửi tối đa **1 lời mời / ứng viên / 30 ngày**. Ứng viên từ chối thì 30 ngày sau mới được mời lại.

### 5.16. Thông báo

| Sự kiện | Trong ứng dụng | Email | Tắt được |
|---|---|---|---|
| Xác minh email, đặt lại mật khẩu | | ✓ | |
| Đổi mật khẩu, đổi email, bật/tắt 2FA, liên kết mạng xã hội | ✓ | ✓ | |
| Kết quả eKYC | ✓ | ✓ | |
| Thanh toán thành công | ✓ | ✓ | |
| Nộp hồ sơ thành công | ✓ | ✓ | |
| Nhà tuyển dụng đã xem hồ sơ | ✓ | | |
| Thay đổi trạng thái hồ sơ ứng tuyển | ✓ | ✓ | |
| Lịch phỏng vấn mới / thay đổi lịch | ✓ | ✓ | |
| Nhắc lịch phỏng vấn (24 giờ, 1 giờ) | ✓ | ✓ | |
| Tin nhắn mới, lời mời chat | ✓ | | |
| Phản hồi báo cáo vi phạm / yêu cầu hỗ trợ | ✓ | ✓ | |
| Yêu cầu xóa tài khoản, khôi phục tài khoản | | ✓ | |
| Job alert | | ✓ | ✓ |
| Gợi ý job | ✓ | | ✓ |
| Công ty đang theo dõi đăng tin mới | ✓ | | ✓ |

**Cài đặt thông báo:** thông báo bảo mật, giao dịch và trạng thái hồ sơ luôn bật. Người dùng được tắt các loại có đánh dấu ở cột "Tắt được".

### 5.17. An toàn

**Báo cáo vi phạm:**
- Lý do: tin giả, yêu cầu nộp tiền, mô tả/mức lương sai sự thật, nội dung không phù hợp, khác.
- Kèm mô tả và ảnh minh chứng (không bắt buộc).
- Người báo cáo theo dõi được kết quả xử lý.

**Chặn doanh nghiệp:** doanh nghiệp bị chặn không tìm thấy và không liên hệ được với ứng viên.

### 5.18. Loại tài khoản

Tài khoản có hai thuộc tính độc lập.

**Trạng thái xác thực:**

| Trạng thái | Điều kiện |
|---|---|
| **Chưa xác thực** | Mặc định khi đăng ký |
| **Đã xác thực** | eKYC được duyệt (tự động hoặc Admin) |

**Gói dịch vụ:**

| Gói | Điều kiện / Cách kích hoạt |
|---|---|
| **Thường** | Mặc định khi đăng ký |
| **Pro** | Bắt buộc Đã xác thực. Chi tiết: *(Đang cập nhật)* |
| **Premium** | Bắt buộc Đã xác thực. Chi tiết: *(Đang cập nhật)* |
| **Education** | Bắt buộc Đã xác thực. Dành riêng cho học sinh, sinh viên. Kích hoạt bằng mã quà tặng phát tại các sự kiện của hệ thống ở trường đại học. Các cách xác minh khác: *(Đang cập nhật)* |

**Quy tắc mã Education:**
- Mỗi mã dùng một lần cho một tài khoản.
- Hạn kích hoạt mã: *(Đang cập nhật)*.
- Thời hạn gói: **1 năm** kể từ ngày kích hoạt.
- Hết thời hạn → trở về gói Thường.

### 5.19. Thanh toán

**Phương thức:** chuyển khoản ngân hàng qua **SePay**.

**Hình thức mua:** mua trực tiếp gói dịch vụ hoặc gói lượt (ví dụ: gói lượt feedback CV cấp độ 3). Không có ví nạp tiền. Lượt đã mua không quy đổi lại thành tiền.

**Luồng thanh toán:**
1. Người dùng chọn mua → hệ thống tạo **đơn hàng** với mã duy nhất.
2. Hiển thị **mã QR chuyển khoản**, điền sẵn số tiền và nội dung chứa mã đơn.
3. Hệ thống chạy **cronjob mỗi 1 phút** lấy giao dịch mới từ SePay, đối chiếu mã đơn trong nội dung chuyển khoản.
4. Khớp đơn → kiểm tra số tiền → kích hoạt gói hoặc cộng lượt, gửi thông báo và email xác nhận.

**Quy tắc:**

| Trường hợp | Xử lý |
|---|---|
| Đơn chờ thanh toán | Hết hạn sau **30 phút** |
| Giao dịch đã xử lý | Mỗi giao dịch chỉ xử lý **một lần**, không cộng lượt hai lần |
| Chuyển **đủ** hoặc **thừa** tiền | Tự động kích hoạt. Phần thừa không hoàn lại |
| Chuyển **thiếu** tiền | Không kích hoạt |
| Hoàn tiền | Admin xử lý thủ công |

**Lịch sử giao dịch:** mã đơn, nội dung, số tiền, thời gian, trạng thái (Chờ thanh toán, Thành công, Hết hạn, Đã hoàn tiền).

### 5.20. Thông báo và đồng ý xử lý dữ liệu

Áp dụng trước khi sử dụng:
- Các chức năng AI: đọc CV, feedback CV, phỏng vấn tự động, gợi ý job, tạo Cover Letter.
- eKYC (gửi CCCD và dữ liệu khuôn mặt sang FPT.AI).
- Job gần bạn (truy cập vị trí).

Nội dung chi tiết: *(Đang cập nhật)*.

### 5.21. Hỗ trợ & Xóa tài khoản

**Gửi yêu cầu hỗ trợ**, ví dụ: lỗi xác minh, mất quyền truy cập, mất phương thức 2FA, xét duyệt eKYC thủ công.

**Xóa tài khoản:**

Xóa tài khoản ứng viên **không ảnh hưởng** đến tài khoản nhà tuyển dụng dùng cùng email (nếu có).

*Bước 1 — Yêu cầu xóa*
- Hệ thống hiển thị các ảnh hưởng: hồ sơ ứng tuyển đang chờ xử lý, lịch phỏng vấn sắp tới, gói và lượt còn hạn.
- Người dùng xác nhận bằng **mã gửi về email**.

*Chặn xóa tạm thời* khi còn:
- Giao dịch đang xử lý.
- Yêu cầu hoàn tiền hoặc khiếu nại đang mở.

*Cảnh báo, không chặn* khi còn gói Pro/Premium/Education hoặc lượt đã mua chưa dùng hết: người dùng sẽ mất phần còn lại.

*Bước 2 — 7 ngày chờ*
- Profile bị ẩn; không xuất hiện trong Tìm ứng viên.
- Đăng nhập lại trong 7 ngày → tài khoản được khôi phục.

*Bước 3 — Hết 7 ngày*
- Xóa: tài khoản, KYC, thông tin cá nhân, profile, CV, toàn bộ hồ sơ đã nộp, chat.
- Nhà tuyển dụng của các tin đã nộp thấy hồ sơ ở trạng thái **"Ứng viên đã xóa tài khoản"**, không còn xem được CV và thông tin liên hệ.
- **Giữ lại:** chứng từ giao dịch (hóa đơn, thanh toán) theo quy định pháp luật về kế toán và thuế; hồ sơ xử lý vi phạm.

### 5.22. Thiết kế Cover Letter

Công cụ riêng để ứng viên tạo và quản lý Cover Letter (thư xin việc). **Cover Letter không nộp kèm hồ sơ ứng tuyển** trên InterVue.

- Tạo Cover Letter mới, có nút **"Tạo bằng AI"**: AI viết bản nháp dựa trên CV ứng viên chọn, và một tin tuyển dụng nếu ứng viên chọn thêm.
- Chỉnh sửa nội dung, lưu nhiều Cover Letter, đặt tên, xóa.
- Mẫu trình bày: *(Đang cập nhật)*.
- Tải về file PDF.
- Giới hạn số Cover Letter và lượt dùng AI theo gói: *(Đang cập nhật)*.

**Nguyên tắc:**
- AI chỉ dùng thông tin có trong CV, không thêm kinh nghiệm/kỹ năng không có thật.
- Ứng viên xem lại và chỉnh sửa trước khi lưu.

---

## 6. Quy tắc chung cho chức năng AI

| Trường hợp | Xử lý |
|---|---|
| AI lỗi hoặc quá thời gian | Thông báo rõ ràng, cho thử lại. **Không trừ lượt** |
| AI lỗi ở chức năng có tính phí | **Tự động hoàn lượt** |
| Dữ liệu cá nhân nhạy cảm | Không dùng tuổi, giới tính, ảnh, quê quán, dữ liệu KYC trong bất kỳ đánh giá nào của AI |
| Nội dung AI tạo | Không thêm kinh nghiệm, kỹ năng không có thật. Người dùng luôn xem lại trước khi lưu hoặc gửi |

---

## 7. Chức năng tính phí của ứng viên

- Feedback CV cấp độ 3: tính phí.
- Gói Pro / Premium: *(Đang cập nhật)*.
- Không thu phí ứng viên để chat với nhà tuyển dụng.

---

## 8. Phụ thuộc vào vai trò khác

| Chức năng ứng viên | Cần phía | Nội dung cần có |
|---|---|---|
| Ứng tuyển, câu hỏi sàng lọc (5.13) | Recruiter | Chọn hình thức nộp hồ sơ, tạo câu hỏi sàng lọc khi tạo tin |
| Chặn tự ứng tuyển vào tin của mình (5.13) | Recruiter | Email tài khoản nhà tuyển dụng đăng tin |
| Trạng thái hồ sơ, Đã xem (5.13) | Recruiter | Mở hồ sơ, chuyển trạng thái hồ sơ |
| Lịch phỏng vấn (5.14) | Recruiter | Tạo, sửa lịch phỏng vấn |
| Lời mời chat (5.15), Chặn doanh nghiệp (5.17), Lượt xuất hiện trong tìm kiếm (5.2) | Recruiter | Tính năng **Tìm ứng viên** |
| Lượt lưu hồ sơ (5.2) | Recruiter | Chức năng **lưu hồ sơ ứng viên** |
| Job gần bạn (1.3) | Recruiter | Địa chỉ làm việc của tin tuyển dụng |
| Trang công ty, Công ty nổi bật (1.4, 1.5) | Recruiter, Admin | Thông tin doanh nghiệp; xác minh doanh nghiệp; tiêu chí chọn công ty nổi bật |
| Danh mục dùng chung (đầu tài liệu, 5.3) | Admin | Quản lý danh mục vị trí, cấp bậc, kỹ năng; cập nhật danh mục đơn vị hành chính |
| eKYC (5.9) | Admin | Duyệt eKYC, xét duyệt thủ công sau 5 lần, xử lý CCCD trùng |
| Báo cáo vi phạm (5.17) | Admin | Tiếp nhận, xử lý báo cáo |
| Thanh toán (5.19) | Admin | Hoàn tiền thủ công |
| Hỗ trợ (5.21) | Admin | Tiếp nhận, xử lý yêu cầu hỗ trợ |
| Gói Education (5.18) | Admin | Tạo và phát mã Education |

---

## 9. Mục còn chờ chốt

- Gói Pro / Premium: quyền lợi và giá.
- Gói Education: các cách xác minh khác, hạn kích hoạt mã.
- Giá feedback CV cấp độ 3 và các gói lượt.
- Phỏng vấn tự động: giới hạn và phí.
- Thiết kế Cover Letter: mẫu trình bày, giới hạn theo gói.
- Feedback CV: giới hạn cho các gói ngoài gói Thường.
- Nội dung thông báo và đồng ý xử lý dữ liệu.
