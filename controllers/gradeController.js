const db = require("../config/db");
exports.index = (req, res) => {
    const sql = `
        SELECT
            grades.*,
            students.student_code,
            students.fullname AS student_name,
            subjects.subject_name,
            teachers.fullname AS teacher_name
        FROM grades
        LEFT JOIN students
            ON grades.student_id = students.id
        LEFT JOIN subjects
            ON grades.subject_id = subjects.id
        LEFT JOIN teachers
            ON grades.teacher_id = teachers.id
        ORDER BY students.fullname
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi cơ sở dữ liệu");
        }
        res.render("grades/index", {
            grades: results
        });
    });
};
exports.create = (req, res) => {
    db.query("SELECT * FROM students", (err, students) => {
        if (err) return res.status(500).send(err);
        db.query("SELECT * FROM subjects", (err, subjects) => {
            if (err) return res.status(500).send(err);
            db.query("SELECT * FROM teachers", (err, teachers) => {
                if (err) return res.status(500).send(err);
                res.render("grades/create", {
                    students,
                    subjects,
                    teachers
                });
            });
        });
    });
};
exports.store = (req, res) => {
    let {
        student_id,
        subject_id,
        teacher_id,
        midterm,
        final
    } = req.body;
    midterm = parseFloat(midterm);
    final = parseFloat(final);
    const average = ((midterm + final) / 2).toFixed(2);
    const sql = `
        INSERT INTO grades
        (
            student_id,
            subject_id,
            teacher_id,
            midterm,
            final,
            average
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [
            student_id,
            subject_id,
            teacher_id,
            midterm,
            final,
            average
        ],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Không thể thêm điểm");
            }
            res.redirect("/grades");
        }
    );
};
exports.edit = (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT * FROM grades WHERE id=?",
        [id],
        (err, grade) => {
            if (err) return res.status(500).send(err);
            db.query("SELECT * FROM students", (err, students) => {
                db.query("SELECT * FROM subjects", (err, subjects) => {
                    db.query("SELECT * FROM teachers", (err, teachers) => {
                        res.render("grades/edit", {
                            grade: grade[0],
                            students,
                            subjects,
                            teachers
                        });
                    });
                });
            });
        }
    );
};
exports.update = (req, res) => {
    const id = req.params.id;
    let {
        student_id,
        subject_id,
        teacher_id,
        midterm,
        final
    } = req.body;
    midterm = parseFloat(midterm);
    final = parseFloat(final);
    const average = ((midterm + final) / 2).toFixed(2);
    const sql = `
        UPDATE grades
        SET
            student_id=?,
            subject_id=?,
            teacher_id=?,
            midterm=?,
            final=?,
            average=?
        WHERE id=?
    `;
    db.query(
        sql,
        [
            student_id,
            subject_id,
            teacher_id,
            midterm,
            final,
            average,
            id
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể cập nhật");
            }
            res.redirect("/grades");
        }
    );
};
exports.destroy = (req, res) => {
    const id = req.params.id;
    db.query(
        "DELETE FROM grades WHERE id=?",
        [id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể xóa");
            }
            res.redirect("/grades");
        }
    );
};
exports.show = (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT
            grades.*,
            students.student_code,
            students.fullname AS student_name,
            subjects.subject_name,
            teachers.fullname AS teacher_name
        FROM grades
        LEFT JOIN students
            ON grades.student_id = students.id
        LEFT JOIN subjects
            ON grades.subject_id = subjects.id
        LEFT JOIN teachers
            ON grades.teacher_id = teachers.id
        WHERE grades.id=?
    `;
    db.query(
        sql,
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi");
            }
            res.render("grades/show", {
                grade: results[0]
            });
        }
    );
};
exports.studentGrades = (req, res) => {
    const studentId = req.params.id;
    const sql = `
        SELECT
            subjects.subject_name,
            grades.midterm,
            grades.final,
            grades.average
        FROM grades
        JOIN subjects
            ON grades.subject_id = subjects.id
        WHERE grades.student_id = ?
    `;
    db.query(
        sql,
        [studentId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi");
            }
            res.render("grades/student", {
                grades: results
            });
        }
    );
};
exports.search = (req, res) => {
    const keyword = req.query.keyword;
    const sql = `
        SELECT
            grades.*,
            students.student_code,
            students.fullname AS student_name,
            subjects.subject_name
        FROM grades
        JOIN students
            ON grades.student_id = students.id
        JOIN subjects
            ON grades.subject_id = subjects.id
        WHERE
            students.fullname LIKE ?
            OR students.student_code LIKE ?
            OR subjects.subject_name LIKE ?
    `;
    db.query(
        sql,
        [
            `%${keyword}%`,
            `%${keyword}%`,
            `%${keyword}%`
        ],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi");
            }
            res.render("grades/index", {
                grades: results
            });
        }
    );
};