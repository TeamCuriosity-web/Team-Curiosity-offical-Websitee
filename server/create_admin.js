const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmins = async () => {
  try {
    // 1. Create/Update SUPER ADMIN
    const superEmail = 'super@legendary.com';
    const superPassword = 'super123';
    
    let superUser = await User.findOne({ email: superEmail });
    if (superUser) {
      superUser.password = superPassword;
      superUser.role = 'superadmin';
      superUser.name = 'The Architect';
      await superUser.save();
      console.log('Super Admin ensured.');
    } else {
      await User.create({
        name: 'The Architect',
        email: superEmail,
        password: superPassword,
        role: 'superadmin'
      });
      console.log('Super Admin created.');
    }

    // 2. REMOVE STANDARD ADMIN (Commander)
    // User requested permanent removal.
    await User.deleteOne({ email: 'admin@legendary.com' });
    console.log('Commander Admin removed perminanently.');
  } catch (err) {
    console.error('Admin Seeding Error:', err);
  }
};

module.exports = seedAdmins;
