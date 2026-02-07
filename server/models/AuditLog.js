const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'CREATE_ADMIN', 'DELETE_USER', 'UPDATE_PROJECT'
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  targetId: { type: String }, // ID of the object being acted upon
  targetCollection: { type: String }, // e.g., 'User', 'Project'
  details: { type: mongoose.Schema.Types.Mixed }, // Flexible object for extra info (diffs, etc.)
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
