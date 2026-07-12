const express = require("express");
const accountRoutes = require("./accountRoutes");
const authRoutes = require("./authRoutes");
const classRoutes = require("./classRoutes");
const facultyRoutes = require("./facultyRoutes");
const portalRoutes = require("./portalRoutes");
const studentRoutes = require("./studentRoutes");
const subjectRoutes = require("./subjectRoutes");
const db = require("../config/database");
const { requireAuth, requireAdmin } = require("../middleware/requireAuth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    data: {
      service: "student-management-api",
      status: "ok",
      endpoints: ["/api/health", "/api/students", "/api/classes", "/api/subjects", "/api/accounts", "/api/faculties"]
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

// Public routes — không cần đăng nhập
router.use("/auth", authRoutes);
router.use("/faculties", facultyRoutes);

// Protected routes — cần đăng nhập + quyền admin
router.use("/accounts", requireAuth, requireAdmin, accountRoutes);
router.use("/classes", requireAuth, requireAdmin, classRoutes);
router.use("/students", requireAuth, requireAdmin, studentRoutes);
router.use("/subjects", requireAuth, subjectRoutes);
router.use("/portal", requireAuth, portalRoutes);

module.exports = router;
