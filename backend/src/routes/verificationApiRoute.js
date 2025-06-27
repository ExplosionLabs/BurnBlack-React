const {
  getPanNameController,
  getGSTDataController,
  getAllGSTDataController,
} = require("../controller/verificationApiController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/verifyPan", authMiddleware, getPanNameController);
router.post("/getGSTData", adminMiddleware, getGSTDataController);
router.get("/getAllGSTData", adminMiddleware, getAllGSTDataController);

module.exports = router;
