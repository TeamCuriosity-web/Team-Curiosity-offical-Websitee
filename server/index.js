const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message'); 

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes')); 
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));


io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', async (data) => {
    
    try {
      if (data.sender && data.content) {
         
         const newMessage = new Message({
            sender: data.senderId, 
            content: data.content,
            room: data.room || 'general',
            timestamp: new Date()
         });
         await newMessage.save();
         
         
         
         
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

  socket.on('typing', (data) => {
    
    socket.to(data.room).emit('display_typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('hide_typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/legendary-team')
.then(async () => {
    console.log('MongoDB Connected [Elite Mode]');
    
    const seedAdmins = require('./create_admin');
    await seedAdmins();
})
.catch(err => console.error('MongoDB Error:', err));


app.get('/', (req, res) => {
  res.send('Server is Running - Unauthorized Access Prohibited (System v2.0 - Chat Active)');
});


if (require.main === module) {
  server.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.io Initialized`);
  });
}

module.exports = app;
