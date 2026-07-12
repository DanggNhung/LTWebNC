# Student Management

Student Management là hệ thống quản lý sinh viên, lớp học, môn học, tài khoản, đăng ký môn và điểm học tập. Dự án được tổ chức theo hướng Frontend ReactJS, Backend Node.js API và Database MySQL để dễ mở rộng, bảo trì và kết nối dữ liệu thật.

## Mục Tiêu

- Xây dựng hệ thống quản lý đào tạo có cấu trúc rõ ràng, dễ phát triển tiếp.
- Tách biệt giao diện, nghiệp vụ API và cơ sở dữ liệu.
- Hạn chế mock data, ưu tiên đọc ghi dữ liệu thật qua MySQL.
- Hỗ trợ các vai trò chính: Quản trị viên, Giảng viên và Sinh viên.

## Tính Năng Chính

- Đăng nhập theo vai trò và phân quyền truy cập theo tài khoản.
- Quản trị viên quản lý tài khoản, sinh viên, lớp học và môn học.
- Sinh viên xem thông tin cá nhân, đăng ký môn học và theo dõi kết quả học tập.
- Giảng viên quản lý điểm theo môn học được phân công.
- Dữ liệu Khoa, Ngành, Lớp, Môn học, Tài khoản, Sinh viên và Điểm được kết nối qua API và MySQL.

## Kiến Trúc

```text
React Frontend  <->  Express API  <->  MySQL Database
```

```text
LTWebNC/
├── Backend/
│   ├── database/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── utils/
└── Frontend/
    ├── public/
    ├── scripts/
    └── src/
        ├── components/
        ├── data/
        ├── hooks/
        ├── pages/
        ├── services/
        ├── styles/
        └── utils/
```

- `Backend/`: toàn bộ phần Node.js/Express API, chịu trách nhiệm xử lý nghiệp vụ và giao tiếp với MySQL.
- `Backend/database/`: chứa schema, seed, reset script và migration SQL để khởi tạo hoặc cập nhật database.
- `Backend/src/config/`: cấu hình kết nối database và các thiết lập nền của backend.
- `Backend/src/controllers/`: nhận request từ route, gọi service và trả response JSON.
- `Backend/src/middleware/`: xử lý auth, CORS, lỗi và các bước trung gian của request.
- `Backend/src/repositories/`: lớp truy vấn MySQL, tách riêng SQL khỏi nghiệp vụ.
- `Backend/src/routes/`: định nghĩa các API endpoint.
- `Backend/src/services/`: xử lý nghiệp vụ chính của tài khoản, sinh viên, lớp học, môn học, điểm và portal.
- `Backend/src/utils/`: helper dùng chung cho backend.
- `Frontend/`: toàn bộ phần ReactJS, chịu trách nhiệm giao diện và gọi API từ backend.
- `Frontend/public/`: tài nguyên tĩnh dùng trực tiếp bởi trình duyệt.
- `Frontend/scripts/`: script hỗ trợ chạy hoặc phục vụ bản build.
- `Frontend/src/components/`: component giao diện có thể tái sử dụng.
- `Frontend/src/data/`: dữ liệu cấu hình tĩnh như navigation, form field và cấu trúc khoa ngành.
- `Frontend/src/hooks/`: custom hook dùng chung cho gọi API và quản lý trạng thái bảng.
- `Frontend/src/pages/`: các màn hình chính theo route.
- `Frontend/src/services/`: lớp gọi API từ frontend sang backend.
- `Frontend/src/styles/`: CSS nền, layout, component và page.
- `Frontend/src/utils/`: helper dùng chung cho frontend.

## Công Nghệ

- Frontend: ReactJS, Vite, JavaScript, CSS.
- Backend: Node.js, ExpressJS.
- Database: MySQL.
- Authentication: session-based auth phục vụ demo nhiều vai trò.
- Password: bcrypt để mã hóa mật khẩu.
- Tooling: npm, Git.

## Yêu Cầu Môi Trường

- Node.js 18 trở lên.
- npm.
- MySQL Server.
- MySQL Workbench hoặc công cụ tương đương để chạy SQL.
- Trình duyệt hiện đại như Chrome, Edge hoặc Firefox.
- Git để quản lý mã nguồn.
