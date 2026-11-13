# Module Job: chức năng và ràng buộc (để test)

Tài liệu liệt kê chức năng của phần **tin tuyển dụng (Job)** theo từng vai trò: Recruiter, Candidate/Guest, Admin. Mỗi chức năng có mô tả, ràng buộc, mã lỗi và gợi ý cách test.
Nguồn: code backend `modules/job`, `modules/application`, `modules/ai` và frontend `app/`, `components/`. Ngày soạn: 2026-11-13.

## 1. Tổng quan

### 1.1 Vòng đời trạng thái của một job

| Trạng thái | Ý nghĩa | Chuyển được sang |
|---|---|---|
| `DRAFT` | Bản nháp, chỉ recruiter thấy | `PUBLISHED`, `PENDING_REVIEW` |
| `PENDING_REVIEW` | Chờ admin duyệt (tin đầu tiên của công ty) | `PUBLISHED` (admin approve), `DRAFT` (admin reject) |
| `PUBLISHED` | Đang tuyển, công khai | `PAUSED`, `CLOSED`, `EXPIRED`, `HIDDEN_BY_ADMIN` |
| `PAUSED` | Recruiter tạm dừng | `PUBLISHED`, `CLOSED`, `EXPIRED`, `HIDDEN_BY_ADMIN` |
| `CLOSED` | Recruiter đã đóng | `PUBLISHED` (renew) |
| `EXPIRED` | Quá hạn nộp hồ sơ | `PUBLISHED` (renew) |
| `HIDDEN_BY_ADMIN` | Admin ẩn | `PUBLISHED`, `EXPIRED`, `CLOSED` |

Mọi chuyển trạng thái trái bảng trên trả lỗi `INVALID_STATUS_TRANSITION` (422).

### 1.2 Vai trò và quyền

| Vai trò | Tài khoản | Quyền với job |
|---|---|---|
| Guest | Không đăng nhập | Xem danh sách, chi tiết, gần tôi, gợi ý (mặc định) |
| Candidate | Bảng `users`, role `CANDIDATE` | Như guest, thêm: báo cáo job, lưu job, ứng tuyển |
| Recruiter | Bảng `recruiters` (tài khoản riêng) | Tạo và quản lý job của **chính mình** trong công ty của mình |
| Admin | Bảng `users`, role `ADMIN` | Duyệt, ẩn, khôi phục job; quản lý danh mục kỹ năng |

Recruiter chỉ thấy và sửa job do **chính họ tạo** (kiểm tra theo `recruiterId`). Job của người khác trả `NOT_FOUND` (404), không lộ sự tồn tại.

### 1.3 Điều kiện để recruiter đăng được tin

Gọi là "đủ điều kiện đăng tin" khi **tất cả** đúng (bước xác thực công ty):

1. Email đã xác thực.
2. Số điện thoại đã xác thực.
3. Đã liên kết với một công ty.
4. Đã chấp nhận các thỏa thuận (candidate agreement và platform agreement).
5. Giấy tờ của chính recruiter (giấy phép kinh doanh) đã được admin duyệt và còn hiệu lực.

Thiếu điều kiện thì publish bị chặn với một trong các lỗi: `EMAIL_NOT_VERIFIED`, `NOT_COMPANY_MEMBER`, `VERIFICATION_INCOMPLETE`, `RECRUITER_NOT_AUTHORIZED_FOR_COMPANY` (đều 4xx). Tạo và lưu **nháp** thì không cần đủ điều kiện, chỉ cần thuộc một công ty.

### 1.4 Hạn mức đăng tin miễn phí (admin chỉnh được ở cấu hình free quota)

| Cấu hình | Mặc định | Ý nghĩa |
|---|---|---|
| `requireJobSlot` | `false` | `false`: không cần mua gói vẫn đăng được trong hạn mức miễn phí. `true`: bắt buộc có lượt đăng (slot) |
| `jobFreePostLimit` | 3 | Tổng số lần một công ty được đăng miễn phí **trọn đời** (xem mục 1.5) |
| `jobFreeMaxDays` | 60 | Tin miễn phí chạy tối đa bấy nhiêu ngày kể từ lúc đăng |
| `jobReviewFirstCount` | 3 | Công ty chưa có đủ bấy nhiêu tin được duyệt thì tin mới phải chờ admin duyệt |

Nếu công ty có gói đã mua (slot), dùng slot trước, hạn tin không được vượt thời hạn gói. Hết lượt: `ENTITLEMENT_EXHAUSTED` (422). Slot hết hạn: `ENTITLEMENT_EXPIRED` (422).

### 1.5 Lượt đăng miễn phí trọn đời

- Mỗi **công ty** được đăng miễn phí tổng cộng `jobFreePostLimit` lần (mặc định 3). Hết lượt thì phải mua gói (slot) mới đăng được.
- Một lượt bị tính khi tin lên sóng mà không dùng slot đã mua: lần đăng đầu, hoặc mỗi lần **Renew** không có gói. Với tin phải chờ duyệt, lượt được tính lúc admin duyệt.
- Tạm dừng, tiếp tục (Resume) và đóng **không** tốn thêm và **không** hoàn lại lượt. Tin nháp chưa đăng không tính.
- Mỗi tin miễn phí vẫn chạy tối đa `jobFreeMaxDays` ngày (mặc định 60).
- Các lượt được ghi ở bảng `job_free_posts` (một dòng cho mỗi lượt). Công ty có sẵn tin cũ vẫn bắt đầu đếm từ 0.
- Hai recruiter cùng công ty dùng chung các lượt này.

## 2. Recruiter

Màn hình: `/recruiter/jobs` (danh sách), `/recruiter/jobs/create` (đăng tin), `/recruiter/jobs/[id]` (sửa). API: `/api/v1/recruiter/jobs`, yêu cầu role `RECRUITER`.

### 2.1 Danh sách tin và bộ đếm

| Mục | Nội dung |
|---|---|
| Chức năng | Xem tin của mình, 4 thẻ thống kê (Hiring, Paused, Draft, Expired), các tab lọc, tìm kiếm theo tiêu đề, sắp xếp, phân trang, thao tác hàng loạt (tạm dừng, đóng), nhân bản |
| API | `GET /recruiter/jobs?status=&q=&sort=&page=&size=`, `GET /recruiter/jobs/summary` |
| Ràng buộc | `q` tối đa 100 ký tự. Chỉ trả tin của chính recruiter. Số ở thẻ là số theo trạng thái trên toàn bộ tin của mình |
| Cách test | Tạo vài tin ở các trạng thái khác nhau, kiểm tra số trên thẻ khớp, bấm thẻ/tab thì lọc đúng, tìm theo tên, đổi trang. Tab chỉ hiện nhãn, không còn số |

### 2.2 Tạo và lưu nháp

| Mục | Nội dung |
|---|---|
| Chức năng | Form 3 bước (Basics, Content, Review). Nút **Save draft**. Tự động lưu nháp sau 2,5 giây ngừng thao tác (chỉ khi tiêu đề hợp lệ, chưa đăng). Cuộn lên đầu trang khi đổi bước |
| API | `POST /recruiter/jobs` (tạo), `PUT /recruiter/jobs/{id}` (sửa) |
| Ràng buộc nháp | Phải thuộc một công ty (`NOT_COMPANY_MEMBER` 403). Chỉ **bắt buộc tiêu đề** 5–150 ký tự. Các trường khác tùy chọn khi là nháp |
| Cách test | Nhập tiêu đề rồi chờ 3 giây: thấy "Saving…" rồi "Draft saved", F5 vẫn còn. Tiêu đề < 5 ký tự thì không tự lưu. Bấm Save draft khi tiêu đề trống thì nhảy về bước 1 |

### 2.3 Ràng buộc dữ liệu của form (áp dụng cả client và server)

| Trường | Ràng buộc |
|---|---|
| Title | 5–150 ký tự |
| Job role | Bắt buộc khi đăng: BACKEND, FRONTEND, FULLSTACK, MOBILE, DEVOPS, QA, DATA_AI, BA, PM, UIUX, SECURITY, OTHER |
| Level | Bắt buộc khi đăng: INTERN, JUNIOR, MID, SENIOR, LEAD |
| Contract type | Bắt buộc khi đăng: FULL_TIME, PART_TIME, INTERNSHIP |
| Working arrangement | Bắt buộc khi đăng: ON_SITE, HYBRID, REMOTE, FLEXIBLE |
| Experience | 0–30 năm; min ≤ max |
| Location | City bắt buộc khi đăng, chọn từ danh sách tỉnh/thành, tối đa 100 ký tự. Address tối đa 500 ký tự |
| Vị trí bản đồ | Kinh độ và vĩ độ phải **có cả hai hoặc không có cả hai**; vĩ độ −90..90, kinh độ −180..180. Tự tìm tọa độ sau khi ngừng gõ địa chỉ 1,5 giây, hoặc bấm nút **Search by address** (nút bị vô hiệu khi chưa có địa chỉ/thành phố), hoặc click/kéo ghim |
| Salary | Hoặc **Negotiable**, hoặc nhập min và max. min ≤ max, có chọn Gross/Net. VND: 1.000.000 đến 250.000.000 (UI nhập theo triệu). USD: 50 đến 10.000 |
| Skills | Khi đăng: ít nhất 1, tối đa 20. Chỉ chọn được kỹ năng đang `active`, nếu không báo "unknown or inactive" |
| Description | Khi đăng: ≥ 50 ký tự. Tối đa 20.000 |
| Requirements | Khi đăng: ≥ 20 ký tự. Tối đa 20.000 |
| Benefits | Tùy chọn, tối đa 20.000 ký tự |
| Benefit tags | Tối đa 10 thẻ |
| Hiring steps | Tối đa 6 bước, mỗi bước ≤ 80 ký tự |
| Deadline | Hôm nay trở đi và **không quá 90 ngày** kể từ hôm nay (giờ Việt Nam) |
| Openings | Số nguyên 1–100, mặc định 1. Chỉ là thông tin hiển thị cho ứng viên, **không** tự đóng tin khi đủ người |
| Screening questions | Tối đa 5. Prompt ≤ 300 ký tự. `CHOICE` cần 2–6 lựa chọn khác nhau (không phân biệt hoa thường), mỗi lựa chọn ≤ 100. `SHORT_TEXT` bỏ qua lựa chọn |

Nút **Fill demo job** (chỉ hiện khi không phải production) điền sẵn dữ liệu mẫu: TP. Hồ Chí Minh, "84A Nguyen Hong, Hanh Thong", mô tả/yêu cầu/quyền lợi dài, 10 thẻ quyền lợi, 5 bước tuyển.

### 2.4 Tạo mô tả bằng AI ("Generate job description with AI")

| Mục | Nội dung |
|---|---|
| Chức năng | Nút trong bước Content, AI soạn mô tả, yêu cầu, quyền lợi dựa trên các trường đã nhập |
| Hạn mức miễn phí | **10 lượt mỗi tháng cho mỗi công ty** (không phải mỗi người). Cấu hình `aiJdGenerateFreePerMonth`, admin chỉnh được. Đặt lại vào 00:00 ngày 1 hàng tháng, giờ Việt Nam |
| Muốn có thêm | Mua gói **ADD-ON AI JD GENERATOR** ở `/recruiter/services`: cộng **100 lượt**, không hết hạn. (Giá demo hiện là 2.000 VND do seed demo) |
| Thứ tự trừ lượt | Trừ lượt miễn phí trước, hết mới trừ lượt đã mua |
| Khi hết cả hai | Lỗi `AI_USER_QUOTA_EXCEEDED` |
| Cách test | Dùng AI đến khi hết 10 lượt, kiểm tra báo hết lượt. Mua add-on và kiểm tra số lượt còn tăng thêm 100. Qua tháng mới số lượt miễn phí về 10 |

### 2.5 Đăng tin (Publish)

| Mục | Nội dung |
|---|---|
| API | `POST /recruiter/jobs/{id}/publish` |
| Chỉ áp dụng | Tin `DRAFT` (trạng thái khác: `INVALID_STATUS_TRANSITION`) |
| Kiểm tra theo thứ tự | (1) Đủ điều kiện đăng tin (mục 1.3). (2) Đủ trường bắt buộc (mục 2.3), thiếu thì trả danh sách lỗi theo từng trường. (3) Nội dung không chứa từ cấm mức **SEVERE** (lỗi theo trường, nêu từ vi phạm). (4) Còn lượt đăng: slot đã mua, hoặc hạn mức miễn phí (mục 1.4) |
| Kết quả | Công ty chưa đủ `jobReviewFirstCount` tin đã duyệt: tin sang `PENDING_REVIEW`, admin được báo. Ngược lại tin sang `PUBLISHED` ngay, trừ 1 slot, gửi sự kiện tin mới đăng |
| Từ cấm mức MILD | Không chặn, nhưng tự tạo một báo cáo hệ thống để admin xem lại |
| Cách test | Thiếu trường (xem lỗi theo trường). Tin đầu tiên của công ty mới (phải chờ duyệt). Tin thứ 4 trở đi của công ty đã có 3 tin được duyệt (lên thẳng). Đăng lần thứ 4 khi công ty đã dùng hết 3 lượt miễn phí (`ENTITLEMENT_EXHAUSTED`), dù 3 tin cũ đã đóng hay tạm dừng. Hạn > 60 ngày khi dùng gói miễn phí (lỗi hạn "Free job posts can run until …") |

### 2.6 Sửa tin

| Mục | Nội dung |
|---|---|
| API | `PUT /recruiter/jobs/{id}` |
| Trạng thái sửa được | `DRAFT`, `PUBLISHED`, `PAUSED`. Trạng thái khác: `JOB_NOT_EDITABLE` (422) |
| Tin đã đăng | Sửa phải **vẫn thỏa đầy đủ quy tắc đăng tin** (trường bắt buộc, từ cấm, hạn trong khoảng slot/gói miễn phí). Nội dung mới bị quét từ cấm lại |
| Câu hỏi sàng lọc | Khi tin đã có hồ sơ ứng tuyển thì **không đổi được** câu hỏi: `SCREENING_QUESTIONS_LOCKED` (422) |
| Thông báo ứng viên | Đổi tiêu đề, lương, địa điểm, loại hợp đồng hoặc hình thức làm việc thì người đã ứng tuyển được thông báo |
| Lịch sử | Mỗi lần sửa tin đã đăng ghi vào lịch sử cùng danh sách trường đã đổi |

### 2.7 Tạm dừng và tiếp tục

| Mục | Nội dung |
|---|---|
| Pause | `POST /recruiter/jobs/{id}/pause`: chỉ từ `PUBLISHED`. Lưu thời điểm tạm dừng. Tin ẩn khỏi trang công khai |
| Resume | `POST /recruiter/jobs/{id}/resume`: chỉ từ `PAUSED`. Hạn nộp hồ sơ và thời hạn slot được **cộng thêm đúng thời gian đã tạm dừng**. Kiểm tra lại điều kiện đăng, trường bắt buộc, từ cấm, slot còn hạn, hạn miễn phí. Không tốn thêm slot |
| Lỗi hay gặp | `INVALID_STATUS_TRANSITION`, `ENTITLEMENT_EXPIRED` (slot đã hết hạn lúc tiếp tục) |
| Cách test | Tạm dừng, đợi, tiếp tục và kiểm tra hạn nộp tăng thêm |

### 2.8 Đóng tin, gia hạn, kéo dài

| Chức năng | Điều kiện | Hành vi |
|---|---|---|
| Close | `PUBLISHED` hoặc `PAUSED` | Sang `CLOSED`, lưu thời điểm đóng, phát sự kiện `JobClosedEvent` |
| Renew (đăng lại) | `CLOSED` hoặc `EXPIRED` | Cần deadline mới (hôm nay trở đi, ≤ 90 ngày). Kiểm tra lại như đăng mới. **Mở lại miễn phí** nếu tin do recruiter đóng trong vòng **7 ngày** và gói đã mua vẫn còn hạn, ngược lại tốn 1 slot hoặc dùng hạn mức miễn phí. Ngày đăng được đặt lại, gửi sự kiện đăng tin |
| Extend (kéo dài hạn) | `PUBLISHED` hoặc `PAUSED` | Deadline mới phải **sau** deadline hiện tại, nếu không báo lỗi "Choose a date after the current deadline". Không vượt hạn gói đã mua (hoặc cửa sổ miễn phí 60 ngày tính từ ngày đăng) |

### 2.9 Xóa tin

`DELETE /recruiter/jobs/{id}`: **chỉ xóa được tin `DRAFT`**. Tin ở trạng thái khác trả `JOB_NOT_EDITABLE` (422). Muốn bỏ tin đã đăng thì dùng Close.

### 2.10 Tin tương tự (cảnh báo trùng)

`GET /recruiter/jobs/similar?title=&city=&excludeId=`: trả tối đa 5 tin **đang `PUBLISHED`** của cùng công ty có cùng tiêu đề và cùng thành phố (không phân biệt hoa thường). Trả rỗng nếu chưa có thành phố. Hiện trong hộp xác nhận trước khi đăng.

### 2.11 Hạn mức (quota)

`GET /recruiter/jobs/quota` trả: số slot còn lại, có bắt buộc slot không, tổng lượt miễn phí, số ngày tối đa của tin miễn phí, số lượt miễn phí đã dùng (`freePostsUsed`).

### 2.12 Thống kê một tin

`GET /recruiter/jobs/{id}/stats?days=` với `days` từ 1 đến 90 (ngoài khoảng: lỗi validation). Trả tổng lượt xem, tổng hồ sơ, tỷ lệ chuyển đổi và số liệu theo ngày. Lượt xem được gom ở Redis và **ghi vào DB mỗi 5 phút**; số của hôm nay đã cộng thêm phần chưa ghi.

### 2.13 Lịch sử thay đổi

`GET /recruiter/jobs/{id}/history`: lịch sử tạo, sửa, đăng, tạm dừng, đóng, gia hạn, bị ẩn, khôi phục (của riêng tin đó, mới nhất trước). Chỉ chủ tin xem được.

### 2.14 Việc chạy tự động

| Việc | Lịch (giờ Việt Nam) | Hành vi |
|---|---|---|
| Hết hạn tin | 00:05 mỗi ngày | Tin quá hạn chuyển `EXPIRED` (trừ tin `PAUSED` và `HIDDEN_BY_ADMIN`) |
| Nhắc sắp hết hạn | 08:00 mỗi ngày | Thông báo cho recruiter có tin hết hạn sau đúng 3 ngày, kèm đường dẫn kéo dài |
| Ghi lượt xem | Mỗi 5 phút | Chuyển bộ đếm Redis sang bảng thống kê ngày |

## 3. Candidate và Guest

Màn hình: `/jobs`, `/jobs/[id]`, `/jobs/near-me`. API công khai: `/api/v1/jobs`.

**Tin nào được coi là công khai:** trạng thái `PUBLISHED` **và** deadline chưa qua (từ hôm nay trở đi). Tin `PAUSED`, `CLOSED`, `EXPIRED`, `DRAFT`, ẩn đều không hiện và chi tiết trả `NOT_FOUND`.

### 3.1 Tìm kiếm và lọc

`GET /api/v1/jobs` (không cần đăng nhập)

| Bộ lọc | Ràng buộc |
|---|---|
| `q` | Tối đa 100 ký tự, tìm theo tiêu đề **và** tên công ty |
| `city` | Khớp chính xác tên thành phố, tối đa 100 |
| `companyId` | Lọc theo công ty |
| `contractType`, `workingArrangement`, `level`, `jobRole` | Theo enum ở mục 2.3 |
| `skillIds` | Tối đa 10; tin có **ít nhất một** kỹ năng trong danh sách |
| `experienceYears` | 0–30; lấy tin không yêu cầu kinh nghiệm hoặc yêu cầu tối thiểu ≤ số đã nhập |
| `salaryFrom` + `currency` | `salaryFrom` ≥ 0 và ≤ 250.000.000; tiền tệ mặc định VND. Chỉ lấy tin **không thương lượng** và `salaryMax` ≥ giá trị |
| `postedWithinDays` | 1–90, tính theo ngày đăng |
| `sort` | `RECOMMENDED` (mặc định), `NEWEST` (đều là mới nhất trước), `SALARY_DESC` (USD quy đổi tỷ giá cố định 25.000), `DEADLINE_ASC` |
| `page`, `size` | Phân trang theo chuẩn của dự án (size tối đa 100) |

Cách test: kết hợp nhiều bộ lọc, đổi sắp xếp, kiểm tra tin đã quá hạn hoặc tạm dừng không xuất hiện, tin có thương lượng lương bị loại khi lọc theo lương.

### 3.2 Chi tiết tin

`GET /api/v1/jobs/{id}`: trả thông tin công khai kèm logo và địa chỉ công ty. Tin không công khai: `NOT_FOUND` (404).

### 3.3 Đếm lượt xem

`POST /api/v1/jobs/{id}/view`: mỗi **IP** chỉ được tính **1 lượt xem mỗi tin mỗi 30 phút** (chống F5 tăng ảo). Tin không công khai: 404. Lỗi Redis không làm hỏng trang (chỉ ghi log). Cách test: mở một tin, gọi lại nhiều lần trong 30 phút, kiểm tra thống kê của recruiter chỉ tăng 1.

### 3.4 Việc làm gần tôi

`GET /api/v1/jobs/nearby?lat=&lng=&radiusKm=`

| Tham số | Ràng buộc |
|---|---|
| `lat` | Bắt buộc, −90..90 |
| `lng` | Bắt buộc, −180..180 |
| `radiusKm` | 1–100, mặc định 10 |

Chỉ tin **có tọa độ** và công khai. Kết quả sắp xếp theo khoảng cách tăng dần, tối đa 100 tin, kèm khoảng cách (km, làm tròn 1 số lẻ). Bản đồ dùng tile Esri; ô tìm địa chỉ dùng Photon. Cách test: đăng một tin có ghim ở HCM, vào trang này với vị trí gần/xa, đổi bán kính.

### 3.5 Gợi ý việc làm

`GET /api/v1/jobs/recommendations?limit=` với `limit` mặc định 6, tối đa 20.

| Tình huống | Kết quả |
|---|---|
| Chưa đăng nhập | Fallback `GUEST`: tin mới nhất kèm lời nhắc đăng nhập |
| Chưa có hồ sơ hoặc hồ sơ trống (không vai trò mong muốn, kỹ năng, thành phố ưa thích) | Fallback `EMPTY_PROFILE`: tin mới nhất kèm lời nhắc hoàn thiện hồ sơ |
| Có hồ sơ nhưng không tin nào khớp | Fallback `NO_MATCH` |
| Không có tin đang mở | `NO_JOBS` (rỗng) |
| Có khớp | Chấm điểm theo kỹ năng trùng (tối đa 55 điểm), vai trò mong muốn, thành phố ưa thích, cấp độ; chỉ giữ tin có điểm > 0, kèm lý do và danh sách kỹ năng khớp |

Xét tối đa 100 tin mới nhất đang mở.

### 3.6 Báo cáo tin (Candidate)

`POST /api/v1/candidate/jobs/{id}/report`, yêu cầu role `CANDIDATE`.

| Ràng buộc | Chi tiết |
|---|---|
| `reasonCode` | Bắt buộc: SCAM, HARASSMENT, SPAM, INAPPROPRIATE, OTHER |
| `note` | Tối đa 500 ký tự, tùy chọn |
| Trùng | Một ứng viên chỉ có **một báo cáo đang chờ** cho mỗi tin: `REPORT_ALREADY_FILED` (409) |
| Tin | Phải đang công khai (không thì 404) |
| Cảnh báo admin | Khi số báo cáo đang chờ của tin đạt đúng **3**, admin được báo |

### 3.7 Lưu tin và ứng tuyển (liên quan đến job, thuộc module khác)

| Chức năng | Ràng buộc |
|---|---|
| Lưu tin (`/candidate/saved-jobs`) | Tối đa **200** tin đã lưu, quá thì `SAVED_LIMIT_REACHED` (409) |
| Ứng tuyển | Tin phải đang mở (`JOB_NOT_OPEN` 422); ứng viên phải qua xác thực danh tính nếu cấu hình bật (`IDENTITY_NOT_VERIFIED`); không được ứng tuyển vào công ty mà email mình đang là thành viên (`CANNOT_APPLY_TO_OWN_COMPANY`); mỗi ứng viên chỉ ứng tuyển **một lần** cho mỗi tin (`ALREADY_APPLIED` 409); mỗi ngày (giờ Việt Nam) tối đa `candidateDailyApplicationLimit` đơn, mặc định 10, tính khi nộp hoặc nộp lại, nháp không tính và rút đơn không hoàn lại (`APPLICATION_DAILY_LIMIT_REACHED` 422), admin chỉnh ở `/admin/services/quotas` |

## 4. Admin

Màn hình: `/admin/moderation/job-posts`, `/admin/catalogs/skills`. API: `/api/v1/admin/jobs`, `/api/v1/admin/skills`, yêu cầu role `ADMIN`.

### 4.1 Danh sách và thống kê

| API | Mô tả và ràng buộc |
|---|---|
| `GET /admin/jobs?q=&status=&companyId=` | Tìm theo tiêu đề hoặc tên công ty (≤ 100 ký tự), lọc theo trạng thái và công ty. **Không hiển thị tin `DRAFT`** |
| `GET /admin/jobs/summary` | Đếm theo trạng thái (không tính `DRAFT`) |
| `GET /admin/jobs/insights?days=` | Số tin chờ duyệt, đã nộp, được duyệt, bị từ chối, tỷ lệ duyệt, thời gian duyệt trung bình (giờ), số tin đăng theo ngày, tin bị báo cáo nhiều nhất |
| `GET /admin/jobs/{id}` | Chi tiết đầy đủ. Tin `DRAFT` trả 404 |

### 4.2 Duyệt tin (Approve / Reject)

| Chức năng | Điều kiện | Hành vi |
|---|---|---|
| `POST /admin/jobs/{id}/approve` | Tin phải ở `PENDING_REVIEW` | Kiểm tra lại điều kiện đăng của recruiter, trường bắt buộc, từ cấm, rồi sang `PUBLISHED` và **lúc này mới trừ slot**. Ghi audit, báo recruiter |
| `POST /admin/jobs/{id}/reject` | Tin ở `PENDING_REVIEW` | Bắt buộc có `reason` (1–500 ký tự). Tin về `DRAFT` để recruiter sửa. Ghi audit, báo recruiter kèm lý do |

Sai trạng thái: `INVALID_STATUS_TRANSITION`. Tin `DRAFT` không tìm thấy: 404.

### 4.3 Ẩn và khôi phục

| Chức năng | Điều kiện | Hành vi |
|---|---|---|
| `POST /admin/jobs/{id}/hide` | Tin `PUBLISHED` hoặc `PAUSED` | Bắt buộc `reason` (1–500 ký tự). Sang `HIDDEN_BY_ADMIN`, lưu lý do, người ẩn, thời điểm. Ghi audit, báo recruiter, phát sự kiện ẩn |
| `POST /admin/jobs/{id}/restore` | Tin `HIDDEN_BY_ADMIN` | Nếu deadline chưa qua thì về `PUBLISHED`, đã qua thì về `EXPIRED`. Xóa lý do ẩn. Ghi audit, báo recruiter |

Tin bị ẩn cũng có thể đến từ luồng xử lý báo cáo (moderation reports) thông qua cùng chức năng ẩn.

### 4.4 Danh mục kỹ năng (Skills)

| API | Ràng buộc |
|---|---|
| `GET /admin/skills` | Tìm và phân trang |
| `POST /admin/skills` | `name` bắt buộc, tối đa 80 ký tự, **không trùng tên** (`SKILL_NAME_ALREADY_USED` 409); `group` bắt buộc: CORE, AI_DATA, TOOLS_DEVOPS, SOFT_SKILLS |
| `PUT /admin/skills/{id}` | Như trên |
| `POST /admin/skills/{id}/activate` và `/deactivate` | Bật/tắt. Kỹ năng đã tắt **không chọn được** khi tạo/sửa tin; gợi ý công khai `GET /skills?query=` chỉ trả kỹ năng đang bật, tối đa 20 kết quả |

## 5. Gợi ý kịch bản test nhanh (end-to-end)

1. **Đăng tin đầu tiên của công ty mới:** recruiter đủ xác thực, tạo tin, Publish → trạng thái `PENDING_REVIEW`. Admin vào `/admin/moderation/job-posts`, Approve → `PUBLISHED` và hiện ở `/jobs`.
2. **Từ chối rồi đăng lại:** admin Reject kèm lý do → tin về `DRAFT`, recruiter nhận thông báo, sửa và Publish lại.
3. **Vòng đời:** Publish, Pause (biến mất khỏi `/jobs`), Resume (hạn cộng thêm), Close, Renew (xem mở lại miễn phí trong 7 ngày).
4. **Hết hạn:** sửa deadline hôm nay, chờ 00:05 hôm sau (hoặc gọi thử dịch vụ hết hạn) → `EXPIRED`, hiện ở tab Expired.
5. **Giới hạn miễn phí:** đăng 3 tin miễn phí (đóng bớt cũng không hoàn lượt), đăng tin thứ 4 → `ENTITLEMENT_EXHAUSTED`; mua gói thì đăng tiếp được.
6. **Báo cáo:** 3 ứng viên khác nhau báo cùng một tin → admin nhận cảnh báo; cùng ứng viên báo lần 2 → 409.
7. **Ẩn/khôi phục:** admin ẩn tin kèm lý do → recruiter thấy thông báo và tab; Restore → quay lại `PUBLISHED` (hoặc `EXPIRED` nếu quá hạn).
8. **Gần tôi:** tin có ghim ở HCM xuất hiện ở `/jobs/near-me` trong bán kính đã chọn.
9. **AI JD:** dùng hết 10 lượt miễn phí → báo hết lượt → mua ADD-ON → có thêm 100 lượt.
10. **Quyền:** recruiter A thử mở/sửa tin của recruiter B → 404; candidate gọi API `/recruiter/jobs` → 403.

## 6. Mã lỗi thường gặp

| Mã | Khi nào |
|---|---|
| `NOT_FOUND` (404) | Tin không tồn tại, không thuộc về mình, hoặc không công khai |
| `NOT_COMPANY_MEMBER` (403) | Recruiter chưa thuộc công ty nào |
| `EMAIL_NOT_VERIFIED`, `VERIFICATION_INCOMPLETE`, `RECRUITER_NOT_AUTHORIZED_FOR_COMPANY` (422) | Chưa đủ điều kiện đăng tin |
| `INVALID_STATUS_TRANSITION` (422) | Thao tác không hợp lệ ở trạng thái hiện tại |
| `JOB_NOT_EDITABLE` (422) | Sửa/xóa tin ở trạng thái không cho phép |
| `SCREENING_QUESTIONS_LOCKED` (422) | Đổi câu hỏi sàng lọc khi đã có hồ sơ |
| `ENTITLEMENT_EXHAUSTED` / `ENTITLEMENT_EXPIRED` (422) | Hết lượt đăng / slot hết hạn |
| `AI_USER_QUOTA_EXCEEDED` | Hết lượt AI tạo JD |
| `REPORT_ALREADY_FILED` (409) | Đã báo cáo tin này |
| `SKILL_NAME_ALREADY_USED` (409) | Trùng tên kỹ năng |
| Lỗi validation (400) | Sai ràng buộc ở mục 2.3, trả danh sách lỗi theo từng trường |

## 7. Lưu ý khi test

- Các giá trị mặc định ở mục 1.4 do admin cấu hình, kết quả test phụ thuộc cấu hình hiện tại trong DB.
- Giá gói ADD-ON trong seed đang là giá demo (vài nghìn đồng), không phải giá thật.
- Tìm địa chỉ dùng dịch vụ Photon, độ chính xác ở mức số nhà kém, có thể kéo ghim bằng tay.
- Gói đẩy tin (nhãn GẤP/HOT, tin nổi bật, đẩy top) thuộc module billing, tài liệu này chưa mô tả chi tiết.
