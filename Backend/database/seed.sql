USE student_management;

INSERT INTO faculties (faculty_code, faculty_name) VALUES
  ('CNTT', 'Công nghệ thông tin'),
  ('DDN', 'Điện - Điện tử'),
  ('KTKD', 'Kinh tế - Kinh doanh'),
  ('NN', 'Ngôn ngữ')
ON DUPLICATE KEY UPDATE
  faculty_name = VALUES(faculty_name);

INSERT INTO majors (faculty_id, major_code, major_name) VALUES
  ((SELECT id FROM faculties WHERE faculty_code = 'CNTT'), 'CNTT', 'Công nghệ thông tin'),
  ((SELECT id FROM faculties WHERE faculty_code = 'CNTT'), 'KHMT', 'Khoa học máy tính'),
  ((SELECT id FROM faculties WHERE faculty_code = 'DDN'), 'TDH', 'Tự động hóa'),
  ((SELECT id FROM faculties WHERE faculty_code = 'DDN'), 'DTVT', 'Điện tử viễn thông'),
  ((SELECT id FROM faculties WHERE faculty_code = 'KTKD'), 'QTKD', 'Quản trị kinh doanh'),
  ((SELECT id FROM faculties WHERE faculty_code = 'KTKD'), 'KT', 'Kế toán'),
  ((SELECT id FROM faculties WHERE faculty_code = 'KTKD'), 'TCNH', 'Tài chính - Ngân hàng'),
  ((SELECT id FROM faculties WHERE faculty_code = 'NN'), 'NNA', 'Ngôn ngữ Anh'),
  ((SELECT id FROM faculties WHERE faculty_code = 'NN'), 'NNT', 'Ngôn ngữ Trung'),
  ((SELECT id FROM faculties WHERE faculty_code = 'NN'), 'NNH', 'Ngôn ngữ Hàn')
ON DUPLICATE KEY UPDATE
  major_name = VALUES(major_name),
  faculty_id = VALUES(faculty_id);

INSERT INTO users (username, password, password_plain, fullname, role, status) VALUES
  ('Admin', '$2b$10$YUt.iXUIyAboiyU1ZFD/s.VdltjVG.4Xi0kcdSkgF34Vp4dDSkA8O', 'SMAdmin@2026!', 'Quản trị hệ thống', 'admin', 'active')
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  password_plain = VALUES(password_plain),
  fullname = VALUES(fullname),
  role = VALUES(role),
  status = VALUES(status);
