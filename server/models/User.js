const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'admin', 'member', 'frontend', 'backend', 'fullstack', 'ai', 'lead'], 
    default: 'member' 
  },
  title: { type: String, default: 'Engineering Team Member' },
  bio: { type: String },
  skills: [{ type: String }],
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  joinedAt: { type: Date, default: Date.now },
  profileImage: { type: String }, // URL to image
  
  // New Enhanced Fields
  avatar: { type: String }, // For the 3D/Selected avatar ID or URL
  college: { type: String },
  branch: { type: String },
  section: { type: String },
  programmingLanguages: [{ type: String }],
  isApproved: { type: Boolean, default: false } // Default to false, requires admin or invite override
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
