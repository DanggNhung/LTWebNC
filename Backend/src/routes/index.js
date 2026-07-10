const express = require("express");
const accountRoutes = require("./accountRoutes");
const authRoutes = require("./authRoutes");
const classRoutes = require("./classRoutes");
const studentRoutes = require("./studentRoutes");
const subjectRoutes = require("./subjectRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    data: {
      service: "student-management-api",
      status: "ok",
      endpoints: ["/api/health", "/api/students", "/api/classes", "/api/subjects", "/api/accounts"]
    }
  });
});

router.get("/health", (req, res) => {
  res.json({
    data: {
      service: "student-management-api",
      status: "ok"
    }
  });
});

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/classes", classRoutes);
router.use("/students", studentRoutes);
router.use("/subjects", subjectRoutes);

module.exports = router;
