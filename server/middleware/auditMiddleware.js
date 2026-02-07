const AuditLog = require('../models/AuditLog');

const logAudit = async (req, action, targetCollection, targetId, details = {}) => {
  try {
    // If user is not authenticated, we can't log the actor
    if (!req.user) return;

    await AuditLog.create({
      action: action.toUpperCase(),
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      targetCollection,
      targetId: targetId ? targetId.toString() : null,
      details,
      ipAddress: req.ip || req.connection.remoteAddress
    });
  } catch (err) {
    console.error('Audit Log Error:', err);
    // Don't block the request if audit logging fails, but log the error
  }
};

module.exports = { logAudit };
