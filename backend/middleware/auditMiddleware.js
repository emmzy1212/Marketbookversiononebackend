import AuditLog from '../models/auditLogModel.js';

export const createAuditLog = async (user, action, resource, resourceId, details, req) => {
  try {
    await AuditLog.create({
      user: user._id,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};