const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('--- Testing MongoDB Atlas Connection ---');
  console.log('URI:', process.env.MONGODB_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('\n========================================');
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('   Host:', conn.connection.host);
    console.log('   DB Name:', conn.connection.name);
    console.log('========================================\n');
    process.exit(0);
  } catch (error) {
    console.log('\n========================================');
    console.log('❌ FAILED to connect to MongoDB Atlas!');
    console.log('   Reason:', error.message);
    console.log('========================================\n');
    process.exit(1);
  }
}

testConnection();
