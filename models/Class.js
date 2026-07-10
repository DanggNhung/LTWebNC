const db = require("../config/db");
const Class = {
    getAll(callback) {
        const sql = `
            SELECT *
            FROM classes
            ORDER BY id ASC
        `;
        db.query(
            sql,
            callback
        );
    },
    findById(id, callback) {
        db.query(
            "SELECT * FROM classes WHERE id=?",
            [id],
            callback
        );
    },
    create(data, callback) {
        db.query(
            "INSERT INTO classes SET ?",
            data,
            callback
        );
    },
    update(id, data, callback) {
        db.query(
            "UPDATE classes SET ? WHERE id=?",
            [
                data,
                id
            ],
            callback
        );
    },
    delete(id, callback) {
        db.query(
            "DELETE FROM classes WHERE id=?",
            [id],
            callback
        );
    },
    getStudents(id, callback) {
        const sql = `
            SELECT *
            FROM students
            WHERE class_id = ?
        `;
        db.query(
            sql,
            [id],
            callback
        );
    }
};
module.exports = Class;