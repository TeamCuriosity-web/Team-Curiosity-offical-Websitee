const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['message', 'alert', 'system'], 
    default: 'message' 
  },
  message: { 
    type: String, 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  // Recipient can be a specific user ID or 'admin' for all admins
  recipient: { 
    type: String, // Can be ObjectId string or 'admin'
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
