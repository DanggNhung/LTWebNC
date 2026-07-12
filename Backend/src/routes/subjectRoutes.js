const express = require("express");
const subjectController = require("../controllers/subjectController");

const { requireAdmin } = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", subjectController.list);
router.post("/", requireAdmin, subjectController.create);
router.put("/:id", requireAdmin, subjectController.update);
router.delete("/:id", requireAdmin, subjectController.remove);

module.exports = router;
