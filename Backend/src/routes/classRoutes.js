const express = require("express");
const classController = require("../controllers/classController");

const router = express.Router();

router.get("/", classController.list);

module.exports = router;
