const {
  uploadForm16Controller,
  updatePersonalDetailController,
  getPersonalDetailController,
  updateContactDetailController,
  getContactDetailController,
  updateAddressDetailController,
  getAddressDetailController,
  updateBankDetails,
  updateBankDetailsController,
  getBankDetailsController,
  postInterestController,
  getInterestController,
  postPropertyDataController,
  getPropertyDataController,
  postRentalDataController,
  getRentalDataController,
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
router.put(
  "/updateContactDetails",
  authMiddleware,
  updateContactDetailController
);
router.get("/getContactDetails", authMiddleware, getContactDetailController);
router.put(
  "/updateAddressDetails",
  authMiddleware,
  updateAddressDetailController
);

router.get("/getAddressDetails", authMiddleware, getAddressDetailController);
router.put("/updateBankDetails", authMiddleware, updateBankDetailsController);
router.get("/getBankDetails", authMiddleware, getBankDetailsController);
router.post("/interest-income", authMiddleware, postInterestController);
router.get("/get-interest-income/:type", authMiddleware, getInterestController);
router.post("/addPropertyData", authMiddleware, postPropertyDataController);
router.get("/getPropertyData", authMiddleware, getPropertyDataController);
router.post("/addRentalData", authMiddleware, postRentalDataController);
router.get("/getRentalData", authMiddleware, getRentalDataController);
module.exports = router;
