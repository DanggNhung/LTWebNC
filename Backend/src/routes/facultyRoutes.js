const express = require("express");
const facultyController = require("../controllers/facultyController");

const router = express.Router();

// Public — không cần auth, dùng cho form chọn khoa/ngành
router.get("/", facultyController.list);

module.exports = router;
