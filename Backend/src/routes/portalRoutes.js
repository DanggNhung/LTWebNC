const express = require("express");
const portalController = require("../controllers/portalController");
const { requireRole } = require("../middleware/requireAuth");

const router = express.Router();

router.get("/student/profile", requireRole("Sinh viên"), portalController.getStudentProfile);
router.put("/student/profile", requireRole("Sinh viên"), portalController.updateStudentProfile);
router.get("/student/subjects", requireRole("Sinh viên"), portalController.listAvailableSubjects);
router.get("/student/enrollments", requireRole("Sinh viên"), portalController.listStudentResults);
router.post("/student/enrollments", requireRole("Sinh viên"), portalController.registerSubjects);
router.delete("/student/enrollments/:enrollmentId", requireRole("Sinh viên"), portalController.cancelStudentEnrollment);

router.get("/teacher/subjects", requireRole("Giảng viên"), portalController.listTeacherSubjects);
router.get("/teacher/scores", requireRole("Giảng viên"), portalController.listTeacherScores);
router.put("/teacher/scores/:enrollmentId", requireRole("Giảng viên"), portalController.updateTeacherScore);

module.exports = router;
