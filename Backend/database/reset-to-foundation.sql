USE student_management;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS subject_classes;
DROP TABLE IF EXISTS semesters;

SET @has_class_advisor_fk = (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'classes'
    AND CONSTRAINT_NAME = 'fk_classes_advisor'
);
SET @sql = IF(@has_class_advisor_fk > 0, 'ALTER TABLE classes DROP FOREIGN KEY fk_classes_advisor', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_class_advisor_index = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'classes'
    AND INDEX_NAME = 'idx_classes_advisor'
);
SET @sql = IF(@has_class_advisor_index > 0, 'ALTER TABLE classes DROP INDEX idx_classes_advisor', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_advisor_id = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'classes'
    AND COLUMN_NAME = 'advisor_id'
);
SET @sql = IF(@has_advisor_id > 0, 'ALTER TABLE classes DROP COLUMN advisor_id', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_advisor_name = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'classes'
    AND COLUMN_NAME = 'advisor_name'
);
SET @sql = IF(@has_advisor_name > 0, 'ALTER TABLE classes DROP COLUMN advisor_name', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DELETE FROM students;
ALTER TABLE students AUTO_INCREMENT = 1;

DELETE FROM subjects;
ALTER TABLE subjects AUTO_INCREMENT = 1;

DELETE FROM classes;
ALTER TABLE classes AUTO_INCREMENT = 1;

DELETE FROM lecturers;
ALTER TABLE lecturers AUTO_INCREMENT = 1;

DELETE FROM users WHERE username <> 'Admin';
ALTER TABLE users AUTO_INCREMENT = 2;

DELETE FROM majors;
ALTER TABLE majors AUTO_INCREMENT = 1;

DELETE FROM faculties;
ALTER TABLE faculties AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

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

SET @has_password_plain = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'password_plain'
);
SET @sql = IF(@has_password_plain = 0, 'ALTER TABLE users ADD COLUMN password_plain VARCHAR(255) NULL AFTER password', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT INTO users (username, password, password_plain, fullname, role, status) VALUES
  ('Admin', '$2b$10$YUt.iXUIyAboiyU1ZFD/s.VdltjVG.4Xi0kcdSkgF34Vp4dDSkA8O', 'SMAdmin@2026!', 'Quản trị hệ thống', 'admin', 'active')
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  password_plain = VALUES(password_plain),
  fullname = VALUES(fullname),
  role = VALUES(role),
  status = VALUES(status);
