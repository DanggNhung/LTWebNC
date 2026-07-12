CREATE DATABASE IF NOT EXISTS student_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_management;

CREATE TABLE IF NOT EXISTS faculties (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  faculty_code VARCHAR(20) NOT NULL,
  faculty_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_faculties_code (faculty_code),
  UNIQUE KEY uq_faculties_name (faculty_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS majors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  faculty_id BIGINT UNSIGNED NOT NULL,
  major_code VARCHAR(30) NOT NULL,
  major_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_majors_code (major_code),
  UNIQUE KEY uq_majors_faculty_name (faculty_id, major_name),
  CONSTRAINT fk_majors_faculty
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL DEFAULT '',
  password_plain VARCHAR(255) NULL,
  fullname VARCHAR(150) NOT NULL,
  role ENUM('admin', 'teacher', 'student') NOT NULL,
  status ENUM('active', 'locked') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  KEY idx_users_role (role),
  KEY idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lecturers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  faculty_id BIGINT UNSIGNED NOT NULL,
  lecturer_code VARCHAR(20) NOT NULL,
  fullname VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lecturers_user (user_id),
  UNIQUE KEY uq_lecturers_code (lecturer_code),
  KEY idx_lecturers_faculty (faculty_id),
  CONSTRAINT fk_lecturers_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_lecturers_faculty
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS classes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_code VARCHAR(30) NOT NULL,
  class_name VARCHAR(150) NOT NULL,
  faculty_id BIGINT UNSIGNED NOT NULL,
  major_id BIGINT UNSIGNED NOT NULL,
  major VARCHAR(150) NOT NULL,
  course SMALLINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_classes_code (class_code),
  KEY idx_classes_faculty (faculty_id),
  KEY idx_classes_major (major_id),
  CONSTRAINT fk_classes_faculty
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_classes_major
    FOREIGN KEY (major_id) REFERENCES majors(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  class_id BIGINT UNSIGNED NULL,
  student_code VARCHAR(20) NOT NULL,
  fullname VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  birthday DATE NULL,
  gender ENUM('Nam', 'Nữ', 'Khác') NULL,
  admission_year SMALLINT UNSIGNED NULL,
  status ENUM('studying', 'reserved') NOT NULL DEFAULT 'studying',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_students_user (user_id),
  UNIQUE KEY uq_students_code (student_code),
  KEY idx_students_class (class_id),
  KEY idx_students_status (status),
  CONSTRAINT fk_students_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_students_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject_code VARCHAR(30) NOT NULL,
  subject_name VARCHAR(150) NOT NULL,
  credits TINYINT UNSIGNED NOT NULL,
  faculty_id BIGINT UNSIGNED NOT NULL,
  lecturer_id BIGINT UNSIGNED NULL,
  knowledge_block ENUM('Giáo dục đại cương', 'Cơ sở ngành', 'Chuyên ngành', 'Bổ trợ') NOT NULL DEFAULT 'Chuyên ngành',
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_subjects_code (subject_code),
  KEY idx_subjects_faculty (faculty_id),
  KEY idx_subjects_lecturer (lecturer_id),
  CONSTRAINT chk_subjects_credits CHECK (credits BETWEEN 1 AND 10),
  CONSTRAINT fk_subjects_faculty
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_subjects_lecturer
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
