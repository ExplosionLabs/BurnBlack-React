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
} = require("../controller/capitalGainController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/postStockMutualData", authMiddleware, postStockMutualControler);
router.post("/editStockMutualData", authMiddleware, updateStockMutualData);
router.get("/getStockMutualData", authMiddleware, getStockMututalData);
router.post("/addForeignAssest", authMiddleware, postForeignAssestControler);
router.get("/getForeignAssest", authMiddleware, getForeignAssetsData);
router.post("/editForeignAssest", authMiddleware, updateForeignAssestData);
router.post("/addLandBuildAssest", authMiddleware, postLandFormController);
router.get("/getLandFormAssest", authMiddleware, getLandFormData);
router.post("/editLandFormAssest", authMiddleware, updateLandFormAssestData);
module.exports = router;
