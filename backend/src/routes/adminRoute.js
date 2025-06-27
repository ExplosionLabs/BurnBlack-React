const express = require("express");
const { adminMiddleware } = require("../middlewares/authMiddleware");
const { getAllUsers } = require("../controller/adminController");
const router = express.Router();

router.get("/protected/admin", adminMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

router.get("/get-all-user", adminMiddleware, getAllUsers);
module.exports = router;
