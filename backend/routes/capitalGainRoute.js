const {
  postStockMutualControler,
  getStockMututalData,
  updateStockMutualData,
  postForeignAssestControler,
  getForeignAssetsData,
  updateForeignAssestData,
  postLandFormController,
  getLandFormData,
  updateLandFormAssestData,
  postStockRsuAssestControler,
  getStockRsuAssetsData,
  updateStockRsuAssestData,
  postBondDebentureAssestControler,
  getBondDebentureAssetsData,
  updateBondDebentureAssestData,
  postLongShortAssestControler,
  getShortLongAssetsData,
  updateLongShortData,
  postGoldAssestControler,
  getGoldAssetsData,
  updateGoldFormAssestData,
  getAllMututalData,
} = require("../controller/capitalGainController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/postStockMutualData", authMiddleware, postStockMutualControler);
router.post(
  "/editStockMutualData/:stockMutualId",
  authMiddleware,
  updateStockMutualData
);
router.get("/getStockMutualData", authMiddleware, getStockMututalData);
router.get("/getAllStockMutualData", authMiddleware, getAllMututalData);
router.post("/addForeignAssest", authMiddleware, postForeignAssestControler);
router.get("/getForeignAssest", authMiddleware, getForeignAssetsData);
router.post(
  "/editForeignAssest/:foreignId",
  authMiddleware,
  updateForeignAssestData
);
router.post("/addLandBuildAssest", authMiddleware, postLandFormController);
router.get("/getLandFormAssest", authMiddleware, getLandFormData);
router.post(
  "/editLandFormAssest/:landId",
  authMiddleware,
  updateLandFormAssestData
);
router.post("/addStockRsuAssest", authMiddleware, postStockRsuAssestControler);
router.get("/getStockRsuAssest", authMiddleware, getStockRsuAssetsData);
router.post(
  "/editStockRsuAssest/:stockRsuId",
  authMiddleware,
  updateStockRsuAssestData
);
router.post(
  "/addBondDebentureAssest",
  authMiddleware,
  postBondDebentureAssestControler
);
router.get(
  "/getBondDebentureAssest",
  authMiddleware,
  getBondDebentureAssetsData
);
router.post(
  "/editBondDebenture/:bondId",
  authMiddleware,
  updateBondDebentureAssestData
);
router.post(
  "/postsLongShortGain",
  authMiddleware,
  postLongShortAssestControler
);
router.get("/getShortLongAssest", authMiddleware, getShortLongAssetsData);
router.post("/editLongShortGain", authMiddleware, updateLongShortData);
router.post("/postsGoldAssests", authMiddleware, postGoldAssestControler);
router.get("/getGoldAssest", authMiddleware, getGoldAssetsData);
router.post(
  "/editGoldAssest/:goldId",
  authMiddleware,
  updateGoldFormAssestData
);
module.exports = router;
