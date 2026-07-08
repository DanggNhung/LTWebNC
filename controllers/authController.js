const db = require("../config/db");
const bcrypt = require("bcrypt");
exports.showLogin = (req, res) => {
    res.render("auth/login");
};
exports.login = (req, res) => {
    const { username, password } = req.body;
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, result) => {
            if (err)
                throw err;
            if (result.length == 0)
                return res.send("Sai tài khoản");
            const user = result[0];
            const check = await bcrypt.compare(
                password,
                user.password
            );
            if (!check)
                return res.send("Sai mật khẩu");
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };
            if (user.role == "admin")
                return res.redirect("/admin");
            if (user.role == "teacher")
                return res.redirect("/teacher");
            return res.redirect("/student");
        }
    );
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};