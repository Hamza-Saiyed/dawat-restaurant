// Run via: npx tsx scripts/changePassword.ts
// Usage:   npx tsx scripts/changePassword.ts <email> <newPassword>
// Example: npx tsx scripts/changePassword.ts admin@dawat.com MyNewPass123

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Admin from '../models/Admin';

dotenv.config({ path: '.env.local' });

async function changePassword() {
  const [, , email, newPassword] = process.argv;

  if (!email || !newPassword) {
    console.error('❌ Usage: npx tsx scripts/changePassword.ts <email> <newPassword>');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters long.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.error(`❌ No admin found with email: ${email}`);
      process.exit(1);
    }

    // Assigning plaintext — the pre-save hook in Admin model will hash it automatically
    admin.password = newPassword;
    await admin.save();

    console.log(`✅ Password updated successfully for: ${email}`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

changePassword();
