const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const email = 'admin@legendary.com';
    const password = 'admin123';
    
    // Check if admin exists
    let user = await User.findOne({ email });

    if (user) {
      user.password = password; // Will be hashed by pre-save hook
      user.role = 'admin';
      await user.save();
      console.log('Admin user updated.');
    } else {
      user = await User.create({
        name: 'The Architect',
        email,
        password,
        role: 'admin'
      });
      console.log('Admin user created.');
    }

    console.log(`
    ---------------------------------------
    ADMIN CREDENTIALS GENERATED
    ---------------------------------------
    Email:    ${email}
    Password: ${password}
    ---------------------------------------
    `);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
