require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vyaha_db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@vyaha.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash: hash, isAdmin: true, name: 'Vyaha Admin' });
  await user.save();
  console.log('Admin created:', email);
  mongoose.disconnect();
}
seed().catch(err => console.error(err));
