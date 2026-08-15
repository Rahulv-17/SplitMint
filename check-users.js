require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const User = require('./server/models/User');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const users = await User.find({});
  console.log('Registered Users:', users.map(u => u.email));
  process.exit(0);
}
run();
