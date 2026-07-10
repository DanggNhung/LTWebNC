const db = require("../config/db");
exports.index = (req, res) => {

    const sql = `
        SELECT *
        FROM subjects
        ORDER BY subject_code ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi cơ sở dữ liệu");
        }

        res.render("subjects/index", {
            subjects: results
        });

    });

};
exports.create = (req, res) => {

    res.render("subjects/create");

};
exports.store = (req, res) => {

    const {
        subject_code,
        subject_name,
        credits,
        description
    } = req.body;

    const sql = `
        INSERT INTO subjects
        (
            subject_code,
            subject_name,
            credits,
            description
        )
        VALUES (?, ?, ?, ?)
    `;
    db.query(
        sql,
        [
            subject_code,
            subject_name,
            credits,
            description
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể thêm môn học");
            }
            res.redirect("/subjects");
        }
    );
};
exports.show = (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT * FROM subjects WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }
            if (results.length === 0) {
                return res.send("Không tìm thấy môn học");
            }
            res.render("subjects/show", {
                subject: results[0]
            });
        }
    );
};
exports.edit = (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT * FROM subjects WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }
            if (results.length === 0) {
                return res.send("Không tìm thấy môn học");
            }
            res.render("subjects/edit", {
                subject: results[0]
            });
        }
    );
};
exports.update = (req, res) => {
    const id = req.params.id;
    const {
        subject_code,
        subject_name,
        credits,
        description
    } = req.body;
    const sql = `
        UPDATE subjects
        SET
            subject_code = ?,
            subject_name = ?,
            credits = ?,
            description = ?
        WHERE id = ?
    `;
    db.query(
        sql,
        [
            subject_code,
            subject_name,
            credits,
            description,
            id
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể cập nhật môn học");
            }
            res.redirect("/subjects");
        }
    );
};
exports.destroy = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM subjects WHERE id = ?",
        [id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Không thể xóa môn học");
            }
            res.redirect("/subjects");
        }
    );
};
exports.search = (req, res) => {
    const keyword = req.query.keyword || "";
    const sql = `
        SELECT *
        FROM subjects
        WHERE subject_code LIKE ?
           OR subject_name LIKE ?
        ORDER BY subject_code ASC
    `;
    db.query(
        sql,
        [
            `%${keyword}%`,
            `%${keyword}%`
        ],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }
            res.render("subjects/index", {
                subjects: results,
                keyword
            });
        }
    );
};