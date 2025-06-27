const Document = require('../models/document');
const { AppError } = require('../utils/appError');
const DocumentMetadataService = require('./documentMetadataService');
const DocumentAuditService = require('./documentAuditService');
const config = require('../config');
const mongoose = require('mongoose');

class DocumentSearchService {
  constructor() {
    this.searchFields = {
      text: ['fileName', 'documentType', 'metadata.description', 'metadata.tags'],
      date: ['createdAt', 'updatedAt', 'metadata.expiryDate'],
      number: ['size', 'metadata.versionNumber'],
      boolean: ['status', 'metadata.isVerified'],
      array: ['metadata.tags', 'metadata.categories']
    };

    this.sortOptions = {
      relevance: { score: { $meta: 'textScore' } },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      nameAsc: { fileName: 1 },
      nameDesc: { fileName: -1 },
      sizeAsc: { size: 1 },
      sizeDesc: { size: -1 },
      typeAsc: { documentType: 1 },
      typeDesc: { documentType: -1 }
    };
  }

  /**
   * Search documents
   * @param {Object} query - Search query
   * @param {Object} options - Search options
   * @returns {Object} Search results
   */
  async searchDocuments(query, options = {}) {
    try {
      const {
        userId,
        text,
        filters = {},
        sort = 'relevance',
        page = 1,
        limit = 20,
        facets = true
      } = options;

      // Build search query
      const searchQuery = this.buildSearchQuery(userId, text, filters);

      // Build aggregation pipeline
      const pipeline = this.buildSearchPipeline(searchQuery, sort, page, limit, facets);

      // Execute search
      const [results, total] = await Promise.all([
        Document.aggregate(pipeline),
        Document.countDocuments(searchQuery)
      ]);

      // Process results
      const processedResults = this.processSearchResults(results);

      // Log search activity
      if (userId) {
        await DocumentAuditService.logActivity(
          'search',
          userId,
          'DOCUMENT_SEARCH',
          {
            query: { text, filters, sort },
            results: processedResults.length
          }
        );
      }

      return {
        results: processedResults,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        facets: facets ? await this.getSearchFacets(searchQuery) : null
      };
    } catch (error) {
      throw new AppError(error.message || 'Error searching documents', error.statusCode || 500);
    }
  }

  /**
   * Build search query
   * @param {string} userId - User ID
   * @param {string} text - Search text
   * @param {Object} filters - Search filters
   * @returns {Object} MongoDB query
   */
  buildSearchQuery(userId, text, filters) {
    const query = {};

    // Add user filter
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    }

    // Add text search
    if (text) {
      query.$text = { $search: text };
    }

    // Add filters
    for (const [field, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        query[field] = { $in: value };
      } else if (typeof value === 'object') {
        // Handle range queries
        if (value.min !== undefined || value.max !== undefined) {
          query[field] = {};
          if (value.min !== undefined) query[field].$gte = value.min;
          if (value.max !== undefined) query[field].$lte = value.max;
        }
        // Handle date range queries
        else if (value.start || value.end) {
          query[field] = {};
          if (value.start) query[field].$gte = new Date(value.start);
          if (value.end) query[field].$lte = new Date(value.end);
        }
      } else {
        query[field] = value;
      }
    }

    return query;
  }

  /**
   * Build search pipeline
   * @param {Object} query - Search query
   * @param {string} sort - Sort option
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @param {boolean} facets - Include facets
   * @returns {Array} Aggregation pipeline
   */
  buildSearchPipeline(query, sort, page, limit, facets) {
    const pipeline = [
      { $match: query }
    ];

    // Add text score if text search is used
    if (query.$text) {
      pipeline.push({
        $addFields: {
          score: { $meta: 'textScore' }
        }
      });
    }

    // Add sort
    pipeline.push({ $sort: this.sortOptions[sort] || this.sortOptions.relevance });

    // Add pagination
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    // Add lookups
    pipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'documentaudits',
          localField: '_id',
          foreignField: 'documentId',
          as: 'recentActivity'
        }
      }
    );

    // Add facets if requested
    if (facets) {
      pipeline.push({
        $facet: {
          metadata: [
            { $group: {
              _id: '$documentType',
              count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
          ],
          status: [
            { $group: {
              _id: '$status',
              count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
          ],
          dateRanges: [
            { $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m',
                  date: '$createdAt'
                }
              },
              count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
          ]
        }
      });
    }

    return pipeline;
  }

  /**
   * Process search results
   * @param {Array} results - Raw search results
   * @returns {Array} Processed results
   */
  processSearchResults(results) {
    return results.map(doc => ({
      ...doc,
      user: doc.user[0] ? {
        id: doc.user[0]._id,
        name: doc.user[0].name,
        email: doc.user[0].email
      } : null,
      recentActivity: doc.recentActivity
        .slice(0, 5)
        .map(activity => ({
          action: activity.action,
          timestamp: activity.timestamp,
          userId: activity.userId
        }))
    }));
  }

  /**
   * Get search facets
   * @param {Object} query - Search query
   * @returns {Object} Facet counts
   */
  async getSearchFacets(query) {
    const [
      typeFacets,
      statusFacets,
      dateFacets
    ] = await Promise.all([
      Document.aggregate([
        { $match: query },
        { $group: {
          _id: '$documentType',
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } }
      ]),
      Document.aggregate([
        { $match: query },
        { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } }
      ]),
      Document.aggregate([
        { $match: query },
        { $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ])
    ]);

    return {
      documentTypes: typeFacets.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.count
      }), {}),
      statuses: statusFacets.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.count
      }), {}),
      dateRanges: dateFacets.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.count
      }), {})
    };
  }

  /**
   * Get document suggestions
   * @param {string} text - Search text
   * @param {Object} options - Search options
   * @returns {Array} Suggestions
   */
  async getSuggestions(text, options = {}) {
    const {
      userId,
      limit = 10
    } = options;

    const query = {
      $text: { $search: text }
    };

    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    }

    const suggestions = await Document.find(query)
      .select('fileName documentType metadata.tags')
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit);

    return suggestions.map(doc => ({
      id: doc._id,
      fileName: doc.fileName,
      documentType: doc.documentType,
      tags: doc.metadata.get('tags') || []
    }));
  }

  /**
   * Get popular searches
   * @param {Object} options - Query options
   * @returns {Array} Popular searches
   */
  async getPopularSearches(options = {}) {
    const {
      startDate,
      endDate,
      limit = 10
    } = options;

    const match = {
      action: 'DOCUMENT_SEARCH'
    };

    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = new Date(startDate);
      if (endDate) match.timestamp.$lte = new Date(endDate);
    }

    const popularSearches = await DocumentAudit.aggregate([
      { $match: match },
      { $unwind: '$details.query.text' },
      {
        $group: {
          _id: '$details.query.text',
          count: { $sum: 1 },
          lastSearched: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return popularSearches.map(search => ({
      text: search._id,
      count: search.count,
      lastSearched: search.lastSearched
    }));
  }

  /**
   * Get search statistics
   * @returns {Object} Search statistics
   */
  async getSearchStats() {
    const [
      totalSearches,
      uniqueSearchers,
      avgResultsPerSearch,
      topSearchedTerms
    ] = await Promise.all([
      DocumentAudit.countDocuments({ action: 'DOCUMENT_SEARCH' }),
      DocumentAudit.distinct('userId', { action: 'DOCUMENT_SEARCH' }),
      DocumentAudit.aggregate([
        { $match: { action: 'DOCUMENT_SEARCH' } },
        {
          $group: {
            _id: null,
            avgResults: { $avg: '$details.results' }
          }
        }
      ]),
      DocumentAudit.aggregate([
        { $match: { action: 'DOCUMENT_SEARCH' } },
        { $unwind: '$details.query.text' },
        {
          $group: {
            _id: '$details.query.text',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return {
      totalSearches,
      uniqueSearchers: uniqueSearchers.length,
      avgResultsPerSearch: avgResultsPerSearch[0]?.avgResults || 0,
      topSearchedTerms: topSearchedTerms.map(term => ({
        term: term._id,
        count: term.count
      }))
    };
  }

  /**
   * Create search index
   */
  async createSearchIndex() {
    // Create text index
    await Document.collection.createIndex(
      {
        fileName: 'text',
        documentType: 'text',
        'metadata.description': 'text',
        'metadata.tags': 'text'
      },
      {
        name: 'document_search',
        weights: {
          fileName: 10,
          documentType: 5,
          'metadata.description': 3,
          'metadata.tags': 2
        }
      }
    );

    // Create compound indexes
    await Document.collection.createIndex(
      { userId: 1, documentType: 1, status: 1 }
    );

    await Document.collection.createIndex(
      { userId: 1, createdAt: -1 }
    );

    await Document.collection.createIndex(
      { userId: 1, 'metadata.expiryDate': 1 }
    );
  }
}

module.exports = new DocumentSearchService(); 