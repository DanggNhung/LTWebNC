const express = require("express");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.get("/", accountController.list);
router.post("/", accountController.create);
router.put("/:id", accountController.update);
router.delete("/:id", accountController.remove);

module.exports = router;
