const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/gradeController");

router.get(
    "/",
    gradeController.index
);
router.get(
    "/create",
    gradeController.create
);
router.post(
    "/create",
    gradeController.store
);
router.get(
    "/:id",
    gradeController.show
);
router.get(
    "/edit/:id",
    gradeController.edit
);
router.post(
    "/edit/:id",
    gradeController.update
);
router.post(
    "/delete/:id",
    gradeController.destroy
);
module.exports = router;