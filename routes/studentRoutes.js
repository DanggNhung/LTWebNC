const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
router.get("/", studentController.index);
router.get("/search", studentController.search);
router.get("/create", studentController.create);
router.post("/create", studentController.store);
router.get("/:id", studentController.show);
router.get("/edit/:id", studentController.edit);
router.post("/edit/:id", studentController.update);
router.post("/delete/:id", studentController.destroy);

module.exports = router;