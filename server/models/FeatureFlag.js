const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'REGISTRATION_OPEN', 'HACKATHON_SUBMISSION'
  isEnabled: { type: Boolean, default: false },
  description: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
