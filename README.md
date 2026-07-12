# LTWebNC

## Kiến trúc

Dự án hiện được tách theo hướng:

- `Backend/`: Node.js + Express + MySQL, chỉ cung cấp API JSON.
- `Frontend/`: ReactJS + Vite, chịu trách nhiệm toàn bộ giao diện và gọi API từ backend.

Luồng chính:

```text
React Frontend  <->  Express API  <->  MySQL
```

## Chạy Backend

```bash
cd Backend
npm install
copy .env.example .env
npm start
```

API mặc định chạy tại:

```text
http://localhost:3000/api
```

Các endpoint chính:

- `GET /api/health`
- `GET /api/students`
- `GET /api/classes`
- `GET /api/subjects`
- `GET /api/accounts`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Backend không render EJS nữa. Nếu cần thêm màn hình mới, ưu tiên tạo API trả JSON rồi để React render ở `Frontend/`.

## Chạy Frontend

```bash
cd Frontend
npm install
copy .env.example .env
npm run dev
```

Frontend mặc định gọi backend qua:

```text
VITE_API_BASE_URL=http://localhost:3000/api
```

Các route mẫu:

- `/`
- `/admin`
- `/admin/tai-khoan`
- `/admin/lop-hoc`
- `/admin/mon-hoc`
- `/sinh-vien`
- `/giang-vien`

Trong lúc backend hoặc MySQL chưa chạy, các trang quản trị vẫn dùng mock data trong `Frontend/src/data` làm fallback để giao diện không bị trắng.
