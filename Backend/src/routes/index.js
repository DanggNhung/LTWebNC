const express = require("express");
const accountRoutes = require("./accountRoutes");
const authRoutes = require("./authRoutes");
const classRoutes = require("./classRoutes");
const studentRoutes = require("./studentRoutes");
const subjectRoutes = require("./subjectRoutes");
const db = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");

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

router.get("/health", asyncHandler(async (req, res) => {
  let database = "ok";

  try {
    await db.testConnection();
  } catch {
    database = "error";
  }

  res.json({
    data: {
      service: "student-management-api",
      status: "ok",
      database
    }
  });
}));

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/classes", classRoutes);
router.use("/students", studentRoutes);
router.use("/subjects", subjectRoutes);

module.exports = router;
