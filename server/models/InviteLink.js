const mongoose = require('mongoose');

const inviteLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who created it
  createdByName: { type: String },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who used it
  usedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InviteLink', inviteLinkSchema);
