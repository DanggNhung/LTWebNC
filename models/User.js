const db = require("../config/db");
const User = {
    findByUsername(username, callback) {

        const sql = `
            SELECT *
            FROM users
            WHERE username = ?
        `;
        db.query(
            sql,
            [username],
            callback
        );

    },
    findById(id, callback) {

        const sql = `
            SELECT *
            FROM users
            WHERE id = ?
        `;
        db.query(
            sql,
            [id],
            callback
        );

    },

    create(data, callback) {

        const sql = `
            INSERT INTO users
            SET ?
        `;
        db.query(
            sql,
            data,
            callback
        );

    },
    update(id, data, callback) {
        const sql = `
            UPDATE users
            SET ?
            WHERE id = ?
        `;
        db.query(
            sql,
            [
                data,
                id
            ],
            callback
        );
    },
    delete(id, callback) {
        db.query(
            "DELETE FROM users WHERE id=?",
            [id],
            callback
        );
    }
};
module.exports = User;