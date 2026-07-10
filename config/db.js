const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "L29**hg_N19*",
    database: "student_management"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected MySQL");
});

module.exports = db;