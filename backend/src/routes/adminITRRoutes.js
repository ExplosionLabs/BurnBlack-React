const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { ITRGeneration } = require('../controllers/ITRControllerMongoDB');
const ITRJSONGenerator = require('../services/ITRJSONGenerator');
const User = require('../models/User');

// Get all ITR downloads with admin analytics
router.get('/itr-downloads', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    // Get ITR downloads with user data using MongoDB
    const downloads = await ITRGeneration.find({})
      .populate('userId', 'name email')
      .sort({ generatedAt: -1 })
      .lean();

    // Transform data for frontend
    const transformedDownloads = downloads.map(download => ({
      id: download._id,
      userId: download.userId._id,
      userName: download.userId?.name || 'Unknown User',
      userEmail: download.userId?.email || 'Unknown Email',
      itrType: download.itrType,
      assessmentYear: download.assessmentYear,
      status: download.status,
      generatedAt: download.generatedAt,
      downloadedAt: download.downloadedAt,
      fileSize: download.metadata?.fileSize || 0,
      taxableIncome: parseFloat(download.metadata?.totalIncome || 0),
      taxPayable: parseFloat(download.metadata?.taxPayable || 0),
      refundAmount: download.metadata?.refundAmount ? parseFloat(download.metadata.refundAmount) : null
    }));

    res.json({
      success: true,
      data: transformedDownloads,
      count: transformedDownloads.length
    });

  } catch (error) {
    console.error('Error in ITR downloads route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get ITR download analytics
router.get('/itr-analytics', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    // Calculate analytics from MongoDB data
    const analytics = await ITRGeneration.aggregate([
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: 1 },
          totalUsers: { $addToSet: "$userId" },
          avgTaxPayable: { $avg: "$metadata.taxPayable" },
          downloadsByType: {
            $push: {
              itrType: "$itrType",
              count: 1
            }
          }
        }
      },
      {
        $project: {
          totalDownloads: 1,
          totalUsers: { $size: "$totalUsers" },
          avgTaxPayable: { $round: ["$avgTaxPayable", 2] },
          downloadsByType: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: analytics[0] || {
        totalDownloads: 0,
        totalUsers: 0,
        avgTaxPayable: 0,
        downloadsByType: []
      }
    });

  } catch (error) {
    console.error('Error in ITR analytics route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Generate ITR for a specific user
router.post('/generate-itr/:userId', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user data from MongoDB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate ITR JSON using MongoDB service
    const generator = new ITRJSONGenerator('AUTO', '2024-25');
    const result = await generator.generateCompliantJSON(userId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to generate ITR JSON - insufficient data'
      });
    }

    // Calculate file size
    const jsonString = JSON.stringify(result.data, null, 2);
    const fileSize = Buffer.byteLength(jsonString, 'utf8');

    // Store in MongoDB
    const download = await ITRGeneration.create({
      userId: userId,
      itrType: result.itrType,
      fileName: result.fileName,
      checksum: result.checksum,
      assessmentYear: result.assessmentYear,
      status: 'generated',
      metadata: {
        ...result.metadata,
        fileSize: fileSize
      },
      generatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'ITR JSON generated successfully',
      data: {
        id: download.id,
        downloadUrl: `/admin/download-itr/${download.id}`
      }
    });

  } catch (error) {
    console.error('Error generating ITR:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Download ITR JSON file
router.get('/download-itr/:downloadId', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { downloadId } = req.params;
    
    // Get ITR download record from MongoDB
    const download = await ITRGeneration.findById(downloadId)
      .populate('userId', 'name email');

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'ITR download not found'
      });
    }

    // Update downloaded_at timestamp
    await ITRGeneration.findByIdAndUpdate(downloadId, { 
      downloadedAt: new Date(),
      status: 'downloaded'
    });

    // Set response headers for file download
    const filename = `ITR_${download.itrType}_${download.assessmentYear}_${download.userId.name.replace(/\s+/g, '_')}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Read file from disk if available
    const fs = require('fs').promises;
    if (download.filePath) {
      try {
        const fileContent = await fs.readFile(download.filePath, 'utf8');
        res.send(fileContent);
      } catch (err) {
        res.status(410).json({
          success: false,
          message: 'ITR file no longer available. Please regenerate.'
        });
      }
    } else {
      res.status(410).json({
        success: false,
        message: 'ITR file not found. Please regenerate.'
      });
    }

  } catch (error) {
    console.error('Error downloading ITR:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Bulk operations
router.post('/bulk-generate-itr', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    // Process each user
    for (const userId of userIds) {
      try {
        const response = await fetch(`${req.protocol}://${req.get('host')}/admin/generate-itr/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          results.success.push({ userId, downloadId: data.data.id });
        } else {
          results.failed.push({ userId, error: 'Generation failed' });
        }
      } catch (error) {
        results.failed.push({ userId, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Bulk ITR generation completed: ${results.success.length} successful, ${results.failed.length} failed`,
      data: results
    });

  } catch (error) {
    console.error('Error in bulk ITR generation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get ITR download by user ID (for checking existing downloads)
router.get('/user-itr/:userId', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const downloads = await ITRGeneration.find({ userId })
      .populate('userId', 'name email')
      .sort({ generatedAt: -1 });

    res.json({
      success: true,
      data: downloads
    });

  } catch (error) {
    console.error('Error in user ITR route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;