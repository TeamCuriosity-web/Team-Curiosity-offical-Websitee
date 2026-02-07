const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // 1. Create/Update SUPER ADMIN
    const superEmail = 'super@legendary.com';
    const superPassword = 'super123';
    
    let superUser = await User.findOne({ email: superEmail });
    if (superUser) {
      superUser.password = superPassword;
      superUser.role = 'superadmin';
      superUser.name = 'The Architect';
      await superUser.save();
      console.log('Super Admin updated.');
    } else {
      await User.create({
        name: 'The Architect',
        email: superEmail,
        password: superPassword,
        role: 'superadmin'
      });
      console.log('Super Admin created.');
    }

    // 2. Create/Update STANDARD ADMIN
    const adminEmail = 'admin@legendary.com';
    const adminPassword = 'admin123';
    
    let adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
        adminUser.password = adminPassword;
        adminUser.role = 'admin'; // FORCE STANDARD ADMIN
        adminUser.name = 'Commander';
        await adminUser.save();
        console.log('Standard Admin updated.');
    } else {
        await User.create({
            name: 'Commander',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });
        console.log('Standard Admin created.');
    }

    console.log(`
    ---------------------------------------
    CREDENTIALS GENERATED
    ---------------------------------------
    [SUPER ADMIN]
    Email:    ${superEmail}
    Password: ${superPassword}
    Role:     superadmin
    ---------------------------------------
    [STANDARD ADMIN]
    Email:    ${adminEmail}
    Password: ${adminPassword}
    Role:     admin
    ---------------------------------------
    `);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
