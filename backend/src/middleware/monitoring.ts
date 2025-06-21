import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { AdminAuditLog } from '../models/AdminAuditLog';
import { ApiError } from '../utils/ApiError';
import { getClientIp } from 'request-ip';

interface AdminRequest extends ExpressRequest {
  user: {
    id: string;
    role: string;
  };
  method: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  body: Record<string, any>;
  get(header: string): string | undefined;
}

export const monitorAdminAction = async (
  req: AdminRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  const originalSend = res.send;
  const startTime = Date.now();

  // Override send method to capture response
  res.send = function (body: any) {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log admin action
    logAdminAction(req, {
      statusCode,
      responseTime,
      responseBody: body,
    }).catch(console.error);

    return originalSend.call(this, body);
  };

  next();
};

const logAdminAction = async (
  req: AdminRequest,
  details: {
    statusCode: number;
    responseTime: number;
    responseBody: any;
  }
) => {
  try {
    const auditLog = new AdminAuditLog({
      adminId: req.user.id,
      action: `${req.method} ${req.path}`,
      targetType: getTargetType(req.path),
      targetId: req.params.id || null,
      details: {
        method: req.method,
        path: req.path,
        query: req.query,
        body: sanitizeRequestBody(req.body),
        statusCode: details.statusCode,
        responseTime: details.responseTime,
        ipAddress: getClientIp(req),
        userAgent: req.get('user-agent'),
      },
    });

    await auditLog.save();
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

const getTargetType = (path: string): string => {
  if (path.includes('/users')) return 'user';
  if (path.includes('/gst')) return 'gst';
  if (path.includes('/settings')) return 'settings';
  if (path.includes('/support')) return 'support';
  return 'system';
};

const sanitizeRequestBody = (body: any): any => {
  const sanitized = { ...body };
  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.secret;
  return sanitized;
};

// Export monitoring status checker
export const getAdminActivityStats = async (timeframe: 'day' | 'week' | 'month') => {
  const now = new Date();
  let startDate: Date;

  switch (timeframe) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 1));
  }

  const stats = await AdminAuditLog.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          action: '$action',
          targetType: '$targetType',
        },
        count: { $sum: 1 },
        avgResponseTime: { $avg: '$details.responseTime' },
        errors: {
          $sum: {
            $cond: [{ $gte: ['$details.statusCode', 400] }, 1, 0],
          },
        },
      },
    },
    {
      $group: {
        _id: '$_id.targetType',
        actions: {
          $push: {
            action: '$_id.action',
            count: '$count',
            avgResponseTime: '$avgResponseTime',
            errors: '$errors',
          },
        },
        totalActions: { $sum: '$count' },
        totalErrors: { $sum: '$errors' },
      },
    },
  ]);

  return stats;
}; 