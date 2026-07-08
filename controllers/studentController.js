const db = require("../config/db");
exports.index = (req, res) => {
    db.query(
        "SELECT * FROM students",
        (err, result) => {
            if (err)
                throw err;
            res.render("students/index", {
                students: result
            });
        }
    );
};
exports.show = (req, res) => {
    db.query(
        "SELECT * FROM students WHERE id=?",
        [req.params.id],
        (err, result) => {
            if (err)
                throw err;
            res.render("students/show", {
                student: result[0]
            });
        }
    );
};
exports.create = (req, res) => {
    res.render("students/create");
};
exports.store = (req, res) => {
    db.query(
        "INSERT INTO students SET ?",
        req.body,
        err => {
            if (err)
                throw err;
            res.redirect("/students");
        }
    );
};
exports.edit = (req, res) => {
    db.query(
        "SELECT * FROM students WHERE id=?",
        [req.params.id],
        (err, result) => {
            res.render("students/edit", {
                student: result[0]
            });
        }
    );
};
exports.update = (req, res) => {
    db.query(
        "UPDATE students SET ? WHERE id=?",
        [req.body, req.params.id],
        err => {
            if (err)
                throw err;
            res.redirect("/students");
        }
    );
};
exports.destroy = (req, res) => {
    db.query(
        "DELETE FROM students WHERE id=?",
        [req.params.id],
        err => {
            if (err)
                throw err;
            res.redirect("/students");
        }
    );
};