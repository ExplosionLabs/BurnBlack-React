const getPanNameController = require("../controller/verificationApiController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/verifyPan", authMiddleware, getPanNameController);

module.exports = router;
