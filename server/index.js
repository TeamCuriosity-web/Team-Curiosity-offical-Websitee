const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message'); // Import Message model

const app = express();
const server = http.createServer(app); // Create HTTP server
// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (adjust for production)
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes')); // Chat HTTP routes

// Socket.io Logic
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', async (data) => {
    // Save message to DB
    try {
      if (data.sender && data.content) {
         // data.sender should be the User ID
         const newMessage = new Message({
            sender: data.senderId, // Expect senderId from client
            content: data.content,
            room: data.room || 'general',
            timestamp: new Date()
         });
         await newMessage.save();
         
         // Populate sender info before emitting back if possible, 
         // OR client sends full sender object for immediate display
         // For simplicity, we emit what we got + timestamp
         const messageToEmit = {
            ...data,
            _id: newMessage._id,
            timestamp: newMessage.timestamp
         };
         
         socket.to(data.room).emit('receive_message', messageToEmit);
      }
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/legendary-team')
.then(async () => {
    console.log('MongoDB Connected [Elite Mode]');
    // Seed Admins on Startup to ensure access
    const seedAdmins = require('./create_admin');
    await seedAdmins();
})
.catch(err => console.error('MongoDB Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is Running - Unauthorized Access Prohibited (System v2.0 - Chat Active)');
});

// Start Server
if (require.main === module) {
  server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.io Initialized`);
  });
}

module.exports = app;
