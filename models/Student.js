const db = require("../config/db");
const Student = {
    getAll(callback) {
        const sql = `
            SELECT 
                students.*,
                classes.class_name
            FROM students
            LEFT JOIN classes
            ON students.class_id = classes.id
            ORDER BY students.id DESC
        `;
        db.query(sql, callback);
    },
    findById(id, callback) {
        db.query(
            "SELECT * FROM students WHERE id=?",
            [id],
            callback
        );
    },
    create(data, callback) {
        db.query(
            "INSERT INTO students SET ?",
            data,
            callback
        );
    },
    update(id, data, callback) {
        db.query(
            "UPDATE students SET ? WHERE id=?",
            [
                data,
                id
            ],
            callback
        );
    },
    delete(id, callback) {
        db.query(
            "DELETE FROM students WHERE id=?",
            [id],
            callback
        );
    },
    search(keyword, callback) {
        const sql = `
            SELECT *
            FROM students
            WHERE fullname LIKE ?
            OR student_code LIKE ?
        `;
        db.query(
            sql,
            [
                `%${keyword}%`,
                `%${keyword}%`
            ],
            callback
        );
    }
};
module.exports = Student;