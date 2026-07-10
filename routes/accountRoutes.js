const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");
router.get("/", accountController.index);
router.get("/search", accountController.search);
router.get("/create", accountController.create);
router.post("/create", accountController.store);
router.get("/:id", accountController.show);
router.get("/edit/:id", accountController.edit);
router.post("/edit/:id", accountController.update);
router.post("/delete/:id", accountController.destroy);

module.exports = router;