USE student_management;

SET @has_password_plain = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'password_plain'
);

SET @sql = IF(
  @has_password_plain = 0,
  'ALTER TABLE users ADD COLUMN password_plain VARCHAR(255) NULL AFTER password',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE users
SET password_plain = 'SMAdmin@2026!'
WHERE username = 'Admin' AND role = 'admin';
