require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const app = express();
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
    session({
        secret: "student-management-secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use("/", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/students", studentRoutes);
app.use("/classes", classRoutes);
app.use("/subjects", subjectRoutes);
app.use("/grades", gradeRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
    if (!req.session.user)
        return res.redirect("/login");
    if (req.session.user.role === "admin")
        return res.redirect("/admin");
    if (req.session.user.role === "teacher")
        return res.redirect("/teacher");
    if (req.session.user.role === "student")
        return res.redirect("/student");
});
app.listen(3000, () => {
    console.log("Server đang chạy trên http://localhost:3000");
});