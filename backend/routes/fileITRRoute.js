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
  postDividendIncomeController,
  getDividendIncomeController,
  updateProfessionalIncomeController,
  updateBussinessIncomeController,
  getBussinessIncomeController,
  getAllInterestController,
  updateProfandBussinessIncomeController,
  getProfandBussinessIncomeController,
  updateFinanceParticularController,
  getFinanceParticularController,
  updateProfitLossController,
  getProfitLossController,
  updateBalanceSheetController,
  getBalanceSheetController,
  deleteDividendIncomeController,
  deleteAllDividendIncomeController,
  postCrytoDataController,
  getCryptoDataController,
  updateCryptoAssestData,
  updateNFTAssestData,
  postDeprectationController,
  getDeprectationController,
  updateDeprectationData,
  postExemptIncomeController,
  getExcemptIncomeController,
  postAgriController,
  getAgriController,
  postExempRemController,
  getExemptRemController,
  postBussinesFundController,
  getBussinessFundController,
  updateBussinessFundData,
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
router.post("/addDividentData", authMiddleware, postDividendIncomeController);
router.get("/getDividentData", authMiddleware, getDividendIncomeController);
router.delete(
  "/deleteDividentData",
  authMiddleware,
  deleteDividendIncomeController
);
router.delete(
  "/deleteAllDividentData",
  authMiddleware,
  deleteAllDividendIncomeController
);
router.post(
  "/addProfesionalIncomeData",
  authMiddleware,
  updateProfessionalIncomeController
);
router.get(
  "/getProfesionalIncomeData",
  authMiddleware,
  updateProfessionalIncomeController
);
router.post(
  "/addBussinessIncomeData",
  authMiddleware,
  updateBussinessIncomeController
);
router.get(
  "/getBussinessIncomeData",
  authMiddleware,
  getBussinessIncomeController
);
router.get("/getInterestIncomeData", authMiddleware, getAllInterestController);
router.post(
  "/addProfandBussinessIncomeData",
  authMiddleware,
  updateProfandBussinessIncomeController
);
router.get(
  "/getProfandBussinessIncomeData",
  authMiddleware,
  getProfandBussinessIncomeController
);
router.post(
  "/addFinanceParticularData",
  authMiddleware,
  updateFinanceParticularController
);
router.get(
  "/getFinanceParticularData",
  authMiddleware,
  getFinanceParticularController
);
router.post("/addProfitLossData", authMiddleware, updateProfitLossController);
router.get("/getProfitLossData", authMiddleware, getProfitLossController);
router.post(
  "/addBalanceSheetData",
  authMiddleware,
  updateBalanceSheetController
);
router.get("/getBalanceSheetData", authMiddleware, getBalanceSheetController);
router.post("/addCryptoIncome", authMiddleware, postCrytoDataController);
router.get("/getCryptoIncome", authMiddleware, getCryptoDataController);
router.post("/updateCryptoIncome", authMiddleware, updateCryptoAssestData);
router.post("/updateNFTIncome", authMiddleware, updateNFTAssestData);
router.post("/addDeprecationEntry", authMiddleware, postDeprectationController);
router.post("/addDeprecationEntry", authMiddleware, postDeprectationController);
router.get("/getDeprecationEntry", authMiddleware, getDeprectationController);
router.post("/updateDeprecationEntry", authMiddleware, updateDeprectationData);
router.post("/addexcempt-income", authMiddleware, postExemptIncomeController);
router.get(
  "/get-excempt-income/:type",
  authMiddleware,
  getExcemptIncomeController
);
router.post("/addagri-income", authMiddleware, postAgriController);

router.get("/getagri-income", authMiddleware, getAgriController);
router.post("/addexemprem-income", authMiddleware, postExempRemController);
router.get("/getexemprem-income/:type", authMiddleware, getExemptRemController);
router.post("/addbussinessFund", authMiddleware, postBussinesFundController);
router.get(
  "/getBussiness-fund/:section",
  authMiddleware,
  getBussinessFundController
);
router.post("/updatebussinessFund", authMiddleware, updateBussinessFundData);
module.exports = router;
