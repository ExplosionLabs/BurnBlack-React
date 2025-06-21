import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetType: string;
  targetId: mongoose.Types.ObjectId | null;
  details: {
    method: string;
    path: string;
    query: Record<string, any>;
    body: Record<string, any>;
    statusCode: number;
    responseTime: number;
    ipAddress: string;
    userAgent: string;
  };
  timestamp: Date;
}

const adminAuditLogSchema = new Schema<IAdminAuditLog>({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  targetType: {
    type: String,
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  details: {
    method: String,
    path: String,
    query: Schema.Types.Mixed,
    body: Schema.Types.Mixed,
    statusCode: Number,
    responseTime: Number,
    ipAddress: String,
    userAgent: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
adminAuditLogSchema.index({ adminId: 1, timestamp: -1 });
adminAuditLogSchema.index({ targetType: 1, targetId: 1 });
adminAuditLogSchema.index({ timestamp: -1 });

export const AdminAuditLog = mongoose.model<IAdminAuditLog>('AdminAuditLog', adminAuditLogSchema); 