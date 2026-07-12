USE student_management;

ALTER TABLE classes
  ADD COLUMN advisor_name VARCHAR(150) NULL AFTER advisor_id;
