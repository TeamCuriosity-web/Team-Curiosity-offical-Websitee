const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
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

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/legendary-team')
.then(() => console.log('MongoDB Connected [Elite Mode]'))
.catch(err => console.error('MongoDB Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is Running - Unauthorized Access Prohibited');
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
