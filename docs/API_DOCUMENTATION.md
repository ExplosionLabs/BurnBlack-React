# API Documentation

## Overview
The BurnBlack API provides a RESTful interface for document management and related operations. This documentation outlines the available endpoints, request/response formats, and authentication requirements.

## Base URL
```
https://api.burnblack.com/v1
```

## Authentication
All API requests require authentication using JWT (JSON Web Tokens).

### Authentication Headers
```
Authorization: Bearer <jwt_token>
```

### Token Types
- Access Token: Short-lived token for regular API access
- Refresh Token: Long-lived token for obtaining new access tokens

## Rate Limiting
- Standard tier: 100 requests per minute
- Premium tier: 500 requests per minute
- Enterprise tier: Custom limits

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

## API Endpoints

### Document Management

#### List Documents
```http
GET /documents
```

Query Parameters:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page
- `sort` (string): Sort field and direction (e.g., "createdAt:desc")
- `type` (string): Filter by document type
- `status` (string): Filter by document status
- `search` (string): Search query

Response:
```json
{
  "data": [
    {
      "id": "string",
      "fileName": "string",
      "documentType": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "metadata": {
        "description": "string",
        "tags": ["string"],
        "expiryDate": "string"
      }
    }
  ],
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

#### Get Document
```http
GET /documents/{documentId}
```

Response:
```json
{
  "id": "string",
  "fileName": "string",
  "documentType": "string",
  "status": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "metadata": {
    "description": "string",
    "tags": ["string"],
    "expiryDate": "string",
    "version": "integer",
    "size": "integer",
    "mimeType": "string"
  },
  "audit": {
    "lastModified": "string",
    "modifiedBy": "string",
    "version": "integer"
  }
}
```

#### Upload Document
```http
POST /documents
Content-Type: multipart/form-data
```

Request Body:
- `file` (file): Document file
- `type` (string): Document type
- `metadata` (object): Document metadata
- `tags` (array): Document tags

Response:
```json
{
  "id": "string",
  "fileName": "string",
  "status": "string",
  "uploadUrl": "string",
  "metadata": {
    "size": "integer",
    "mimeType": "string"
  }
}
```

#### Update Document
```http
PATCH /documents/{documentId}
```

Request Body:
```json
{
  "metadata": {
    "description": "string",
    "tags": ["string"],
    "expiryDate": "string"
  }
}
```

#### Delete Document
```http
DELETE /documents/{documentId}
```

### Document Search

#### Search Documents
```http
GET /documents/search
```

Query Parameters:
- `q` (string): Search query
- `filters` (object): Search filters
- `facets` (boolean): Include facets in response
- `page` (integer): Page number
- `limit` (integer): Items per page
- `sort` (string): Sort option

Response:
```json
{
  "results": [
    {
      "id": "string",
      "fileName": "string",
      "documentType": "string",
      "score": "number",
      "metadata": {
        "description": "string",
        "tags": ["string"]
      }
    }
  ],
  "facets": {
    "documentTypes": {
      "type1": "integer",
      "type2": "integer"
    },
    "statuses": {
      "status1": "integer",
      "status2": "integer"
    },
    "dateRanges": {
      "2024-01": "integer",
      "2024-02": "integer"
    }
  },
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

### Document Versioning

#### List Versions
```http
GET /documents/{documentId}/versions
```

#### Get Version
```http
GET /documents/{documentId}/versions/{versionId}
```

#### Create Version
```http
POST /documents/{documentId}/versions
```

#### Restore Version
```http
POST /documents/{documentId}/versions/{versionId}/restore
```

### Document Sharing

#### Share Document
```http
POST /documents/{documentId}/share
```

Request Body:
```json
{
  "recipientEmail": "string",
  "accessLevel": "string",
  "expiryType": "string",
  "password": "string",
  "allowedActions": ["string"]
}
```

#### List Shares
```http
GET /documents/{documentId}/shares
```

#### Revoke Share
```http
DELETE /documents/{documentId}/shares/{shareId}
```

### Document Audit

#### Get Audit Trail
```http
GET /documents/{documentId}/audit
```

Query Parameters:
- `startDate` (string): Start date
- `endDate` (string): End date
- `action` (string): Filter by action
- `userId` (string): Filter by user

### User Management

#### Get User Profile
```http
GET /users/profile
```

#### Update User Profile
```http
PATCH /users/profile
```

#### Update Notification Preferences
```http
PATCH /users/notifications/preferences
```

### Error Responses

All error responses follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {
      "field": "string",
      "reason": "string"
    }
  }
}
```

Common Error Codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `429`: Too Many Requests
- `500`: Internal Server Error

## Webhooks

### Webhook Events
- `document.created`
- `document.updated`
- `document.deleted`
- `document.shared`
- `document.expired`
- `document.verified`

### Webhook Payload
```json
{
  "event": "string",
  "timestamp": "string",
  "data": {
    "documentId": "string",
    "userId": "string",
    "metadata": {
      "action": "string",
      "details": "object"
    }
  }
}
```

## SDKs and Libraries
- JavaScript/TypeScript SDK
- Python SDK
- Java SDK
- .NET SDK

## Best Practices
1. Always use HTTPS
2. Implement proper error handling
3. Use pagination for large result sets
4. Cache responses when appropriate
5. Implement retry logic for failed requests
6. Use webhooks for real-time updates
7. Follow rate limiting guidelines

## Versioning
API versioning is handled through the URL path. The current version is v1.

## Support
For API support, contact:
- Email: api-support@burnblack.com
- Documentation: https://docs.burnblack.com
- Status Page: https://status.burnblack.com 