// Run via: `npx ts-node scripts/createAdmin.ts`
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Admin from '../models/Admin';

// Load environment variables manually
dotenv.config({ path: '.env.local' });

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    const email = process.env.ADMIN_INITIAL_EMAIL;
    const password = process.env.ADMIN_INITIAL_PASSWORD;

    if (!email || !password) {
      throw new Error('ADMIN_INITIAL_EMAIL or ADMIN_INITIAL_PASSWORD is not defined');
    }

    console.log(`Connecting to MongoDB at: ${mongoUri.split('@')[1] || 'localhost'}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to Database successfully.');

    // Check if user already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists.`);
      console.log('Exiting...');
      process.exit(0);
    }

    console.log(`Creating Admin User: ${email}`);
    
    // Explicitly assigning the password string, model's pre-save hook will hash it
    const newAdmin = new Admin({
      name: 'Super Admin',
      email: email,
      password: password, 
      role: 'super_admin',
      isActive: true,
    });

    await newAdmin.save();
    
    console.log('✅ Admin user created successfully.');
    console.log('You can now log in at /admin/login');

  } catch (error) {
    console.error('❌ Failed to create admin:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }
}

seedAdmin();
