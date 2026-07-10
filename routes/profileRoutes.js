const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.get(
    "/",
    profileController.index
);
router.get(
    "/edit",
    profileController.edit
);
router.post(
    "/edit",
    profileController.update
);
module.exports = router;