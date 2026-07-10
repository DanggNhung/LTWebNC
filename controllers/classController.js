const db = require("../config/db");

// Hiển thị danh sách lớp
exports.index = (req, res) => {

    const sql = `
        SELECT *
        FROM classes
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi cơ sở dữ liệu");
        }

        res.render("classes/index", {
            classes: results
        });

    });

};

// Hiển thị form thêm lớp
exports.create = (req, res) => {

    res.render("classes/create");

};

// Lưu lớp mới
exports.store = (req, res) => {

    const { class_code, class_name, major, course } = req.body;

    const sql = `
        INSERT INTO classes(class_code, class_name, major, course)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [class_code, class_name, major, course],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Không thể thêm lớp");
            }

            res.redirect("/classes");

        }
    );

};

// Hiển thị form sửa lớp
exports.edit = (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM classes WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }

            if (results.length === 0) {
                return res.send("Không tìm thấy lớp");
            }

            res.render("classes/edit", {
                classItem: results[0]
            });

        }
    );

};
exports.update = (req, res) => {
    const id = req.params.id;
    const {
        class_code,
        class_name,
        major,
        course
    } = req.body;
    const sql = `
        UPDATE classes
        SET
            class_code = ?,
            class_name = ?,
            major = ?,
            course = ?
        WHERE id = ?
    `;
    db.query(
        sql,
        [
            class_code,
            class_name,
            major,
            course,
            id
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể cập nhật");
            }
            res.redirect("/classes");
        }
    );
};
exports.destroy = (req, res) => {
    const id = req.params.id;
    db.query(
        "DELETE FROM classes WHERE id = ?",
        [id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể xóa lớp");
            }
            res.redirect("/classes");
        }
    );
};
exports.students = (req, res) => {
    const classId = req.params.id;
    const sql = `
        SELECT
            students.*
        FROM students
        WHERE class_id = ?
        ORDER BY fullname
    `;
    db.query(
        sql,
        [classId],
        (err, students) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }
            db.query(
                "SELECT * FROM classes WHERE id = ?",
                [classId],
                (err, classInfo) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Lỗi cơ sở dữ liệu");
                    }
                    res.render("classes/students", {
                        classItem: classInfo[0],
                        students: students
                    });
                }
            );
        }
    );
};
exports.assignForm = (req, res) => {
    const classId = req.params.id;
    db.query(
        "SELECT * FROM students WHERE class_id IS NULL",
        (err, students) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }
            db.query(
                "SELECT * FROM classes WHERE id = ?",
                [classId],
                (err, classInfo) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Lỗi cơ sở dữ liệu");
                    }
                    res.render("classes/assign", {
                        classItem: classInfo[0],
                        students: students
                    });
                }
            );
        }
    );
};

exports.assignStudent = (req, res) => {
    const classId = req.params.id;
    const { student_id } = req.body;
    const sql = `
        UPDATE students
        SET class_id = ?
        WHERE id = ?
    `;
    db.query(
        sql,
        [classId, student_id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể phân lớp");
            }
            res.redirect(`/classes/${classId}/students`);
        }
    );
};