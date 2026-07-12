USE student_management;

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

SET @has_class_advisor_id = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'classes'
    AND COLUMN_NAME = 'advisor_id'
);
SET @sql = IF(@has_class_advisor_id > 0, 'ALTER TABLE classes DROP COLUMN advisor_id', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_class_advisor_name = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'classes'
    AND COLUMN_NAME = 'advisor_name'
);
SET @sql = IF(@has_class_advisor_name > 0, 'ALTER TABLE classes DROP COLUMN advisor_name', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_class_capacity = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'classes'
    AND COLUMN_NAME = 'capacity'
);
SET @sql = IF(@has_class_capacity > 0, 'ALTER TABLE classes DROP COLUMN capacity', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

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

CREATE TABLE IF NOT EXISTS knowledge_blocks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  block_code VARCHAR(20) NOT NULL,
  block_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_knowledge_blocks_code (block_code),
  UNIQUE KEY uq_knowledge_blocks_name (block_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO knowledge_blocks (block_code, block_name) VALUES
  ('GDDC', 'Giáo dục đại cương'),
  ('CSN', 'Cơ sở ngành'),
  ('CN', 'Chuyên ngành'),
  ('BT', 'Bổ trợ')
ON DUPLICATE KEY UPDATE
  block_name = VALUES(block_name);

SET @has_subject_knowledge_block_id = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subjects'
    AND COLUMN_NAME = 'knowledge_block_id'
);
SET @sql = IF(@has_subject_knowledge_block_id = 0, 'ALTER TABLE subjects ADD COLUMN knowledge_block_id BIGINT UNSIGNED NULL AFTER lecturer_id', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_subject_status = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subjects'
    AND COLUMN_NAME = 'status'
);
SET @sql = IF(@has_subject_status = 0, 'ALTER TABLE subjects ADD COLUMN status ENUM(''active'', ''inactive'') NOT NULL DEFAULT ''active'' AFTER description', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_subject_knowledge_block_index = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subjects'
    AND INDEX_NAME = 'idx_subjects_knowledge_block'
);
SET @sql = IF(@has_subject_knowledge_block_index = 0, 'ALTER TABLE subjects ADD INDEX idx_subjects_knowledge_block (knowledge_block_id)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_subject_knowledge_block_fk = (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subjects'
    AND CONSTRAINT_NAME = 'fk_subjects_knowledge_block'
);
SET @sql = IF(
  @has_subject_knowledge_block_fk = 0,
  'ALTER TABLE subjects ADD CONSTRAINT fk_subjects_knowledge_block FOREIGN KEY (knowledge_block_id) REFERENCES knowledge_blocks(id) ON UPDATE CASCADE ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE subjects
LEFT JOIN knowledge_blocks ON knowledge_blocks.block_name = subjects.knowledge_block
SET subjects.knowledge_block_id = knowledge_blocks.id
WHERE subjects.knowledge_block_id IS NULL;

CREATE TABLE IF NOT EXISTS enrollments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  semester VARCHAR(20) NOT NULL DEFAULT '',
  academic_year VARCHAR(20) NOT NULL DEFAULT '',
  registration_date DATE NULL,
  status ENUM('registered', 'completed', 'cancelled') NOT NULL DEFAULT 'registered',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_enrollments_student_subject (student_id, subject_id),
  KEY idx_enrollments_student (student_id),
  KEY idx_enrollments_subject (subject_id),
  CONSTRAINT fk_enrollments_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scores (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  enrollment_id BIGINT UNSIGNED NOT NULL,
  attendance_score DECIMAL(4,2) NULL,
  midterm_score DECIMAL(4,2) NULL,
  final_score DECIMAL(4,2) NULL,
  score_10 DECIMAL(4,2) NULL,
  score_4 DECIMAL(3,2) NULL,
  letter_grade VARCHAR(5) NULL,
  result_status ENUM('Đạt', 'Học lại') NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_scores_enrollment (enrollment_id),
  CONSTRAINT chk_scores_attendance CHECK (attendance_score IS NULL OR attendance_score BETWEEN 0 AND 10),
  CONSTRAINT chk_scores_midterm CHECK (midterm_score IS NULL OR midterm_score BETWEEN 0 AND 10),
  CONSTRAINT chk_scores_final CHECK (final_score IS NULL OR final_score BETWEEN 0 AND 10),
  CONSTRAINT fk_scores_enrollment
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

UPDATE users
SET password_plain = 'SMAdmin@2026!'
WHERE username = 'Admin' AND role = 'admin';

UPDATE subjects
SET credits = 3
WHERE credits > 3;

UPDATE subjects
SET credits = 1
WHERE credits < 1;

SET @has_subjects_credits_check = (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subjects'
    AND CONSTRAINT_NAME = 'chk_subjects_credits'
    AND CONSTRAINT_TYPE = 'CHECK'
);
SET @sql = IF(@has_subjects_credits_check > 0, 'ALTER TABLE subjects DROP CHECK chk_subjects_credits', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE subjects
ADD CONSTRAINT chk_subjects_credits CHECK (credits BETWEEN 1 AND 3);
