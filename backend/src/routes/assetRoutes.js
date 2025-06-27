const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  postCrypto,
  getCrypto,
  updateCrypto,
  updateNFT
} = require('../controllers/AssetController');

// Crypto Asset Routes
router.post('/crypto', authMiddleware, postCrypto);
router.get('/crypto', authMiddleware, getCrypto);
router.put('/crypto/:id', authMiddleware, updateCrypto);

// NFT Asset Routes
router.put('/nft/:id', authMiddleware, updateNFT);

module.exports = router; 