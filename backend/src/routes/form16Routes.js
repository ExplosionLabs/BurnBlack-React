const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  uploadForm16,
  updateForm16Data,
  getForm16Manual
} = require('../controllers/Form16Controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Form 16 Routes
router.post('/upload', authMiddleware, upload.single('file'), uploadForm16);
router.post('/update-data', authMiddleware, updateForm16Data);
router.get('/manual-data', authMiddleware, getForm16Manual);

module.exports = router; 