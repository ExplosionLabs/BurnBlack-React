const { DocumentService } = require('../services/DocumentService');
const { DocumentSearchService } = require('../services/DocumentSearchService');
const { DocumentVersionService } = require('../services/DocumentVersionService');
const { DocumentShareService } = require('../services/DocumentShareService');
const { DocumentAuditService } = require('../services/DocumentAuditService');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

// Document CRUD operations
exports.listDocuments = asyncHandler(async (req, res) => {
  const { page, limit, sort, type, status, search } = req.query;
  const userId = req.user.id;

  const result = await DocumentService.listDocuments({
    userId,
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    filters: { type, status },
    search
  });

  res.json({
    success: true,
    data: result.documents,
    pagination: result.pagination
  });
});

exports.uploadDocument = asyncHandler(async (req, res) => {
  const { file } = req.files;
  const { type, metadata, tags } = req.body;
  const userId = req.user.id;

  const document = await DocumentService.uploadDocument({
    file,
    type,
    metadata,
    tags,
    userId
  });

  res.status(201).json({
    success: true,
    data: document
  });
});

exports.getDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.user.id;

  const document = await DocumentService.getDocument(documentId, userId);
  if (!document) {
    throw new ApiError(404, 'Document not found');
  }

  res.json({
    success: true,
    data: document
  });
});

exports.updateDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { metadata } = req.body;
  const userId = req.user.id;

  const document = await DocumentService.updateDocument(documentId, {
    metadata,
    userId
  });

  res.json({
    success: true,
    data: document
  });
});

exports.deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.user.id;

  await DocumentService.deleteDocument(documentId, userId);

  res.json({
    success: true,
    message: 'Document deleted successfully'
  });
});

// Document search
exports.searchDocuments = asyncHandler(async (req, res) => {
  const { q, filters, facets, page, limit, sort } = req.body;
  const userId = req.user.id;

  const result = await DocumentSearchService.search({
    query: q,
    filters,
    facets,
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    userId
  });

  res.json({
    success: true,
    data: result.results,
    facets: result.facets,
    pagination: result.pagination
  });
});

// Document versioning
exports.listVersions = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.user.id;

  const versions = await DocumentVersionService.listVersions(documentId, userId);

  res.json({
    success: true,
    data: versions
  });
});

exports.getVersion = asyncHandler(async (req, res) => {
  const { documentId, versionId } = req.params;
  const userId = req.user.id;

  const version = await DocumentVersionService.getVersion(documentId, versionId, userId);
  if (!version) {
    throw new ApiError(404, 'Version not found');
  }

  res.json({
    success: true,
    data: version
  });
});

exports.createVersion = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { file } = req.files;
  const userId = req.user.id;

  const version = await DocumentVersionService.createVersion(documentId, {
    file,
    userId
  });

  res.status(201).json({
    success: true,
    data: version
  });
});

exports.restoreVersion = asyncHandler(async (req, res) => {
  const { documentId, versionId } = req.params;
  const userId = req.user.id;

  const document = await DocumentVersionService.restoreVersion(documentId, versionId, userId);

  res.json({
    success: true,
    data: document
  });
});

// Document sharing
exports.shareDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { recipientEmail, accessLevel, expiryType, password, allowedActions } = req.body;
  const userId = req.user.id;

  const share = await DocumentShareService.shareDocument(documentId, {
    recipientEmail,
    accessLevel,
    expiryType,
    password,
    allowedActions,
    sharedBy: userId
  });

  res.status(201).json({
    success: true,
    data: share
  });
});

exports.listShares = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.user.id;

  const shares = await DocumentShareService.listShares(documentId, userId);

  res.json({
    success: true,
    data: shares
  });
});

exports.revokeShare = asyncHandler(async (req, res) => {
  const { documentId, shareId } = req.params;
  const userId = req.user.id;

  await DocumentShareService.revokeShare(documentId, shareId, userId);

  res.json({
    success: true,
    message: 'Share revoked successfully'
  });
});

// Document audit
exports.getAuditTrail = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { startDate, endDate, action, userId: filterUserId } = req.query;
  const userId = req.user.id;

  const auditTrail = await DocumentAuditService.getAuditTrail(documentId, {
    startDate,
    endDate,
    action,
    userId: filterUserId,
    requesterId: userId
  });

  res.json({
    success: true,
    data: auditTrail
  });
}); 