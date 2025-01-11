const express = require("express");
const { adminMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/protected/admin", adminMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

module.exports = router;
