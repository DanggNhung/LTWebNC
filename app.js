require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

// ========================
// Import Routes
// ========================
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const profileRoutes = require("./routes/profileRoutes");

// ========================
// Middleware
// ========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ========================
// Session
// ========================
app.use(
    session({
        secret: process.env.SESSION_SECRET || "student-management-secret",
        resave: false,
        saveUninitialized: false
    })
);

// ========================
// Routes
// ========================
app.use("/", authRoutes);

app.use("/accounts", accountRoutes);

app.use("/students", studentRoutes);

app.use("/classes", classRoutes);

app.use("/subjects", subjectRoutes);

app.use("/grades", gradeRoutes);

app.use("/profile", profileRoutes);

// ========================
// Dashboard
// ========================
app.get("/", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    switch (req.session.user.role) {

        case "admin":
            return res.redirect("/admin");

        case "teacher":
            return res.redirect("/teacher");

        case "student":
            return res.redirect("/student");

        default:
            return res.redirect("/login");
    }

});

// ========================
// Admin Dashboard
// ========================
app.get("/admin", (req, res) => {

    if (!req.session.user || req.session.user.role !== "admin") {
        return res.redirect("/login");
    }

    res.render("admin/dashboard", {
        user: req.session.user
    });

});

// ========================
// Teacher Dashboard
// ========================
app.get("/teacher", (req, res) => {

    if (!req.session.user || req.session.user.role !== "teacher") {
        return res.redirect("/login");
    }

    res.render("teacher/dashboard", {
        user: req.session.user
    });

});

// ========================
// Student Dashboard
// ========================
app.get("/student", (req, res) => {

    if (!req.session.user || req.session.user.role !== "student") {
        return res.redirect("/login");
    }

    res.render("student/dashboard", {
        user: req.session.user
    });

});

// ========================
// 404
// ========================
app.use((req, res) => {
    res.status(404).render("errors/404");
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});