const express = require('express');
const router = express.Router();
const { verifyToken, checkRole, rateLimiter } = require('../middleware/authMiddleware');
const { validate, documentSchemas, querySchemas } = require('../middleware/validationMiddleware');
const documentController = require('../controllers/documentController');

// Apply rate limiting to all routes
router.use(rateLimiter);

// Apply authentication to all routes
router.use(verifyToken);

// Document CRUD operations
router.get('/',
  validate(querySchemas.list),
  documentController.listDocuments
);

router.post('/',
  checkRole('user', 'admin'),
  validate(documentSchemas.upload),
  documentController.uploadDocument
);

router.get('/:documentId',
  documentController.getDocument
);

router.patch('/:documentId',
  checkRole('user', 'admin'),
  validate(documentSchemas.update),
  documentController.updateDocument
);

router.delete('/:documentId',
  checkRole('user', 'admin'),
  documentController.deleteDocument
);

// Document search
router.get('/search',
  validate(documentSchemas.search),
  documentController.searchDocuments
);

// Document versioning
router.get('/:documentId/versions',
  documentController.listVersions
);

router.get('/:documentId/versions/:versionId',
  documentController.getVersion
);

router.post('/:documentId/versions',
  checkRole('user', 'admin'),
  documentController.createVersion
);

router.post('/:documentId/versions/:versionId/restore',
  checkRole('user', 'admin'),
  documentController.restoreVersion
);

// Document sharing
router.post('/:documentId/share',
  checkRole('user', 'admin'),
  validate(documentSchemas.share),
  documentController.shareDocument
);

router.get('/:documentId/shares',
  documentController.listShares
);

router.delete('/:documentId/shares/:shareId',
  checkRole('user', 'admin'),
  documentController.revokeShare
);

// Document audit
router.get('/:documentId/audit',
  validate(querySchemas.audit),
  documentController.getAuditTrail
);

module.exports = router; 