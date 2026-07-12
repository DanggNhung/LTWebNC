const express = require("express");
const classController = require("../controllers/classController");

const router = express.Router();

router.get("/", classController.list);
router.post("/", classController.create);
router.put("/:id", classController.update);
router.delete("/:id", classController.remove);

module.exports = router;
