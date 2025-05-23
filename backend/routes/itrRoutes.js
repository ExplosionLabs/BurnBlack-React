const express = require("express");
const router = express.Router();
const { generateITR } = require("../controllers/itrController");
const { generateITR2 } = require("../controllers/itr2Controller");
const { generateITR3 } = require("../controllers/itr3Controller");
const { generateITR4 } = require("../controllers/itr4Controller");

// Route to generate ITR-1 JSON
router.get("/generate-itr/:userId", generateITR);

// Route to generate ITR-2 JSON
router.get("/generate-itr2/:userId", generateITR2);
router.get("/generate-itr3/:userId", generateITR3);
router.get("/generate-itr4/:userId", generateITR4);

module.exports = router;
