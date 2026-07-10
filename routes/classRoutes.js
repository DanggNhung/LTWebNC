const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");
router.get("/", classController.index);
router.get("/create", classController.create);
router.post("/create", classController.store);
router.get("/edit/:id", classController.edit);
router.post("/edit/:id", classController.update);
router.post("/delete/:id", classController.destroy);
router.get("/:id", classController.show);
module.exports = router;