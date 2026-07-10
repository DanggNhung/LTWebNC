const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");

router.get(
    "/",
    subjectController.index
);
router.get(
    "/create",
    subjectController.create
);
router.post(
    "/create",
    subjectController.store
);

router.get(
    "/:id",
    subjectController.show
);
router.get(
    "/edit/:id",
    subjectController.edit
);
router.post(
    "/edit/:id",
    subjectController.update
);
router.post(
    "/delete/:id",
    subjectController.destroy
);
module.exports = router;