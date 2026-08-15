const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function testConnection() {
  console.log('Testing connection to MongoDB...');
  console.log('URI:', process.env.MONGODB_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('\n✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('Host:', conn.connection.host);
    console.log('DB Name:', conn.connection.name);
    process.exit(0);
  } catch (error) {
    console.log('\n❌ FAILED to connect to MongoDB Atlas!');
    console.log('Error message:', error.message);
    process.exit(1);
  }
}

testConnection();
