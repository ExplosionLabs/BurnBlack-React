const {
  postStockMutualControler,
  getStockMututalData,
  updateStockMutualData,
} = require("../controller/capitalGainController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/postStockMutualData", authMiddleware, postStockMutualControler);
router.post("/editStockMutualData", authMiddleware, updateStockMutualData);
router.get("/getStockMutualData", authMiddleware, getStockMututalData);
module.exports = router;
