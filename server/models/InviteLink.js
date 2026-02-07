const mongoose = require('mongoose');

const inviteLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InviteLink', inviteLinkSchema);
