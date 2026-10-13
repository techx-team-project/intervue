# Hướng dẫn setup dự án

Làm lần lượt từng bước. Mỗi bước có ghi rõ chạy ở đâu.


## 1. Lấy code mới nhất

Chạy ở: **thư mục gốc**.

```bash
git switch dev
git pull origin dev
```

Rồi tạo branch làm việc của bạn:

```bash
git switch -b <type>/<scope>-<mô-tả>
```

Quy tắc đặt tên branch và commit: `docs/ai/git-commit.md`. Không push trực tiếp vào `main` hoặc `dev`.

## 2. Cài thư viện

**Thư mục gốc**, cài Lefthook. Nó tự format code mỗi khi bạn commit:

```bash
npm i
```

**Thư mục `frontend`**, cài thư viện cho giao diện:

```bash
cd frontend
npm i
```

Backend cần cài sẵn JDK 25 và Maven (kiểm tra bằng `java -version` và `mvn -v`).

## 3. Cài CodeGraph

CodeGraph lập sẵn bản đồ code của dự án. Nhờ đó AI tra cứu đúng chỗ cần thay vì đọc cả đống file, giúp tốn ít token và trả lời nhanh hơn. Bắt buộc cài.

Cài công cụ (làm 1 lần cho cả máy, chạy ở **thư mục bất kỳ**):

```bash
npm i -g @colbymchenry/codegraph
```

Tạo bản đồ cho dự án, chạy ở **thư mục gốc**:

```bash
codegraph init
```

Thư mục `.codegraph/` sinh ra đã bị git ignore, không commit. Sau này code đổi thì index tự cập nhật.

## 4. Đăng nhập GitHub CLI

Hook bảo vệ file hướng dẫn AI dùng tài khoản GitHub của bạn để kiểm tra quyền. Cài [GitHub CLI](https://cli.github.com), rồi chạy ở **thư mục bất kỳ**:

```bash
gh auth login
```

## 5. Tạo file môi trường

### `.env`

Vị trí: **thư mục gốc**. Tạo file `.env` với nội dung:

```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=intervue_db
MYSQL_USER=intervue_user
MYSQL_PASSWORD=intervue_pass
```

Hoặc copy từ file mẫu (chạy ở thư mục gốc): `cp .env.example .env`.

### `application-local.yaml`

Vị trí: `backend/src/main/resources/application-local.yaml`. Nội dung:

```yaml
spring:
  mail:
    username: truongbakhoi1818@gmail.com
    password: jthwcuihhfiizxtv
  flyway:
    locations: classpath:db/migration,classpath:db/seed
  datasource:
    password: i16KOx2Cd1zFmprfPc11

jwt:
  secret: a1M8O206XTw5ITl6NzReN3BKTTNVaWY1L1dnfWFPQjIjaysvV2F3Tm5fZA==
```

Hai giá trị `mail` xin leader qua Zalo, không đăng lên nhóm chung.
Cả hai file đã bị git ignore, tuyệt đối không commit.

## 6. Chạy Docker (MySQL + Redis)

Mở Docker Desktop trước. Chạy ở: **thư mục gốc**.

```bash
docker compose up -d
```

Kiểm tra, cả hai container phải ở trạng thái `healthy`:

```bash
docker compose ps
```

Xem log MySQL khi cần:

```bash
docker compose logs -f mysql
```

Tắt khi xong việc (giữ nguyên dữ liệu):

```bash
docker compose stop
```

Không chạy `docker compose down -v`: lệnh này xoá sạch dữ liệu DB.

## 7. Chạy ứng dụng

Backend, chạy ở **thư mục `backend`** (Docker phải đang chạy). Flyway tự tạo bảng khi khởi động:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Frontend, chạy ở **thư mục `frontend`**, mở terminal khác. Truy cập `http://localhost:3000`:

```bash
cd frontend
npm run dev
```

## 8. Quy định về file hướng dẫn cho AI

- Chỉ `hoangtuanqn` được sửa: mọi `CLAUDE.md` và `AGENTS.md`, thư mục `.claude/` (trừ `settings.local.json`), thư mục `docs/ai/` (trừ `api-contract.md`).
- Thay đổi kiến trúc nặng (thêm/xoá module, đổi layering, mô hình auth/security, persistence, API envelope, đổi framework lõi) phải được `hoangtuanqn` duyệt.
- Việc thường ngày không cần duyệt: thêm dependency task cần, config, endpoint, migration, fix bug.
- Tài liệu dự án (`docs/*.md`, `FUNCTION_REQUIRMENT.md`, `docs/ai/api-contract.md`) ai cũng sửa được.
- Bị chặn: liên hệ leader Phạm Hoàng Tuấn qua Zalo 0812.665.001.

## 9. Trước khi mở PR

Backend, chạy ở **thư mục `backend`**:

```bash
mvn spotless:apply
mvn test
```

Frontend, chạy ở **thư mục `frontend`**:

```bash
npm run lint
npm run build
```

Tiêu đề PR theo format commit, trỏ vào `dev`, không ghi dòng AI attribution.

## 10. Thư mục cá nhân

Tạo `workspace/` ở **thư mục gốc** để lưu ghi chú, script, dữ liệu thử, docs của riêng bạn:

```bash
mkdir -p workspace
```

Thư mục `workspace/` đã được git ignore: không bị commit, người khác không thấy.
