const db = require("../config/db");
const bcrypt = require("bcrypt");
exports.index = (req, res) => {

    const sql = `
        SELECT
            id,
            username,
            fullname,
            role
        FROM users
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi truy vấn cơ sở dữ liệu.");
        }
        res.render("accounts/index", {
            accounts: results
        });
    });
};
exports.create = (req, res) => {
    res.render("accounts/create");
};
exports.store = async (req, res) => {
    try {
        const {
            username,
            password,
            fullname,
            role
        } = req.body;
        if (!username || !password || !fullname || !role) {
            return res.send("Vui lòng nhập đầy đủ thông tin.");
        }
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            async (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Lỗi cơ sở dữ liệu.");
                }
                if (results.length > 0) {
                    return res.send("Tên đăng nhập đã tồn tại.");
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const sql = `
                    INSERT INTO users
                    (
                        username,
                        password,
                        fullname,
                        role
                    )
                    VALUES (?, ?, ?, ?)
                `;
                db.query(
                    sql,
                    [
                        username,
                        hashedPassword,
                        fullname,
                        role
                    ],
                    (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Không thể thêm tài khoản.");
                        }
                        res.redirect("/accounts");
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ.");
    }
};
exports.show = (req, res) => {
    const id = req.params.id;
    db.query(
        `
        SELECT
            id,
            username,
            fullname,
            role,
            created_at
        FROM users
        WHERE id = ?
        `,
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu.");
            }
            if (results.length === 0) {
                return res.send("Không tìm thấy tài khoản.");
            }
            res.render("accounts/show", {
                account: results[0]
            });
        }
    );
};
exports.edit = (req, res) => {
    const id = req.params.id;
    db.query(
        `
        SELECT
            id,
            username,
            fullname,
            role
        FROM users
        WHERE id = ?
        `,
        [id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi cơ sở dữ liệu.");
            }
            if (results.length === 0) {
                return res.send("Không tìm thấy tài khoản.");
            }
            res.render("accounts/edit", {
                account: results[0]
            });
        }
    );
};
exports.update = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            username,
            fullname,
            password,
            role
        } = req.body;

        if (!username || !fullname || !role) {
            return res.send("Vui lòng nhập đầy đủ thông tin.");
        }
        db.query(
            "SELECT * FROM users WHERE username = ? AND id <> ?",
            [username, id],
            async (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Lỗi cơ sở dữ liệu.");
                }
                if (results.length > 0) {
                    return res.send("Tên đăng nhập đã tồn tại.");
                }
                if (password && password.trim() !== "") {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const sql = `
                        UPDATE users
                        SET
                            username = ?,
                            fullname = ?,
                            password = ?,
                            role = ?
                        WHERE id = ?
                    `;

                    db.query(
                        sql,
                        [
                            username,
                            fullname,
                            hashedPassword,
                            role,
                            id
                        ],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send("Không thể cập nhật.");
                            }
                            res.redirect("/accounts");
                        }
                    );
                } else {
                    const sql = `
                        UPDATE users
                        SET
                            username = ?,
                            fullname = ?,
                            role = ?
                        WHERE id = ?
                    `;
                    db.query(
                        sql,
                        [
                            username,
                            fullname,
                            role,
                            id
                        ],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send("Không thể cập nhật.");
                            }
                            res.redirect("/accounts");
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ.");
    }
};
exports.destroy = (req, res) => {
    const id = req.params.id;
    db.query(
        "DELETE FROM users WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Không thể xóa tài khoản.");
            }
            res.redirect("/accounts");
        }
    );
};
exports.search = (req, res) => {
    const keyword = req.query.keyword || "";
    const sql = `
        SELECT
            id,
            username,
            fullname,
            role
        FROM users
        WHERE
            username LIKE ?
            OR fullname LIKE ?
            OR role LIKE ?
        ORDER BY id ASC
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
                return res.status(500).send("Lỗi truy vấn cơ sở dữ liệu.");
            }
            res.render("accounts/index", {
                accounts: results
            });
        }
    );

};