const {
  uploadForm16Controller,
  updatePersonalDetailController,
  getPersonalDetailController,
} = require("../controller/fileITRController");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();
const storage = multer.memoryStorage(); // Alternatively, use diskStorage if required
const upload = multer({ storage });
router.post(
  "/uploadForm",
  authMiddleware,
  upload.single("file"),
  uploadForm16Controller
);

router.put(
  "/updatePersonalDetail",
  authMiddleware,
  updatePersonalDetailController
);
router.get("/getPersonalDetail", authMiddleware, getPersonalDetailController);
module.exports = router;
