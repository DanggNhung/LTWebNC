const db = require("../config/db");
const bcrypt = require("bcrypt");
exports.index = (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const user = req.session.user;

    if (user.role === "student") {

        const sql = `
            SELECT
                users.username,
                users.role,
                students.*
            FROM users
            JOIN students
                ON users.id = students.user_id
            WHERE users.id = ?
        `;

        db.query(sql, [user.id], (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }

            res.render("profile/index", {
                profile: results[0]
            });

        });

    } else if (user.role === "teacher") {

        const sql = `
            SELECT
                users.username,
                users.role,
                teachers.*
            FROM users
            JOIN teachers
                ON users.id = teachers.user_id
            WHERE users.id = ?
        `;

        db.query(sql, [user.id], (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu");
            }

            res.render("profile/index", {
                profile: results[0]
            });

        });

    } else {

        db.query(
            "SELECT username, role FROM users WHERE id=?",
            [user.id],
            (err, results) => {

                if (err) {
                    console.error(err);
                    return res.status(500).send("Lỗi cơ sở dữ liệu");
                }

                res.render("profile/index", {
                    profile: results[0]
                });

            }
        );

    }

};
exports.edit = (req, res) => {

    exports.index(req, res);

};
exports.update = (req, res) => {

    const user = req.session.user;

    if (user.role === "student") {

        const {
            fullname,
            email,
            phone
        } = req.body;

        const sql = `
            UPDATE students
            SET
                fullname = ?,
                email = ?,
                phone = ?
            WHERE user_id = ?
        `;
        db.query(
            sql,
            [
                fullname,
                email,
                phone,
                user.id
            ],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Không thể cập nhật");
                }
                res.redirect("/profile");
            }
        );
    } else if (user.role === "teacher") {
        const {
            fullname,
            email,
            phone
        } = req.body;
        const sql = `
            UPDATE teachers
            SET
                fullname=?,
                email=?,
                phone=?
            WHERE user_id=?
        `;
        db.query(
            sql,
            [
                fullname,
                email,
                phone,
                user.id
            ],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Không thể cập nhật");
                }
                res.redirect("/profile");
            }
        );
    } else {
        res.redirect("/profile");
    }
};
exports.changePasswordForm = (req, res) => {
    res.render("profile/change-password");
};

exports.changePassword = async (req, res) => {

    const userId = req.session.user.id;

    const {
        oldPassword,
        newPassword,
        confirmPassword
    } = req.body;

    if (newPassword !== confirmPassword) {
        return res.send("Mật khẩu xác nhận không khớp");
    }

    db.query(
        "SELECT * FROM users WHERE id=?",
        [userId],
        async (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi");
            }

            if (results.length === 0) {
                return res.send("Không tìm thấy tài khoản");
            }

            const user = results[0];

            const check = await bcrypt.compare(
                oldPassword,
                user.password
            );

            if (!check) {
                return res.send("Mật khẩu cũ không đúng");
            }

            const hashedPassword = await bcrypt.hash(
                newPassword,
                10
            );

            db.query(
                "UPDATE users SET password=? WHERE id=?",
                [
                    hashedPassword,
                    userId
                ],
                (err) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Không thể đổi mật khẩu");
                    }
                    res.redirect("/profile");
                }
            );
        }
    );
};