# Database setup

Thư mục này chứa bộ SQL nền cho MySQL của dự án Student management.

## File trong thư mục

- `schema.sql`: tạo database `student_management` và các bảng nền đang dùng.
- `seed.sql`: thêm dữ liệu nền cố định, gồm Khoa, Ngành và tài khoản Admin.
- `reset-to-foundation.sql`: xóa dữ liệu nghiệp vụ và đưa DB về nền sạch.

## Cách chạy bằng MySQL Workbench

1. Mở MySQL Workbench và kết nối vào MySQL local.
2. Mở file `Backend/database/schema.sql`.
3. Nhấn nút chạy toàn bộ script.
4. Mở file `Backend/database/seed.sql`.
5. Nhấn nút chạy toàn bộ script.

Sau khi chạy xong, database `student_management` sẽ có cấu trúc bảng đầy đủ.

## Reset DB về nền sạch

Khi cần xóa dữ liệu ảo hoặc dữ liệu thử nghiệm, mở file `Backend/database/reset-to-foundation.sql` trong MySQL Workbench và chạy toàn bộ script.

Sau khi reset, DB chỉ giữ lại:

- 4 Khoa cố định.
- 10 Ngành cố định.
- 1 tài khoản Admin.

Các dữ liệu Sinh viên, Lớp học, Môn học, Giảng viên và tài khoản phát sinh sẽ bị xóa.

## Cách chạy bằng terminal

Đứng ở thư mục gốc project:

```powershell
mysql -u root -p < Backend\database\schema.sql
mysql -u root -p < Backend\database\seed.sql
```

Nếu MySQL của bạn không có mật khẩu root, khi được hỏi password chỉ cần nhấn Enter.

## Cấu hình Backend

Kiểm tra file `Backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=student_management
DB_CONNECTION_LIMIT=10
```

Sau đó chạy Backend:

```powershell
cd Backend
npm start
```

Kiểm tra API:

```text
http://localhost:3000/api/health
```

## Tài khoản seed mặc định

- Tên đăng nhập: `Admin`
- Mật khẩu: `SMAdmin@2026!`
- Vai trò: `admin`

Mật khẩu trong DB đã được mã hóa bằng bcrypt, không lưu dạng chữ thường.

## Ý nghĩa các bảng chính

- `faculties`: danh sách Khoa.
- `majors`: danh sách Ngành, mỗi ngành thuộc một Khoa.
- `users`: tài khoản đăng nhập của Admin, Giảng viên, Sinh viên.
- `lecturers`: hồ sơ giảng viên, liên kết với `users`.
- `students`: hồ sơ sinh viên, liên kết với `users` và `classes`.
- `classes`: lớp học, thuộc một ngành.
- `subjects`: môn học, thuộc một khoa và có giảng viên hướng dẫn.

## Lưu ý quan trọng

Frontend Admin đang đọc/ghi qua API MySQL. Các trang Giảng viên và Sinh viên sẽ được nối API thật ở bước sau khi chốt luồng nghiệp vụ điểm.
