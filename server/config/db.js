const mongoose = require('mongoose');
const dns = require('dns');

// Prevent DNS SRV resolution issues on Windows
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\n========================================`);
    console.log(`✅ DATABASE STATUS: Connected to MongoDB Atlas!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`========================================\n`);
  } catch (error) {
    console.log(`\n========================================`);
    console.log(`⚠️ MONGODB ATLAS CONNECTION FAILED:`);
    console.log(`   Reason: ${error.message}`);
    console.log(`⚡ FALLBACK: Launching In-Memory Database...`);
    try {
      await mongoose.disconnect();
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ DATABASE STATUS: Connected to In-Memory Database!`);
      console.log(`   Host: ${conn.connection.host}`);
      console.log(`========================================\n`);
    } catch (memError) {
      console.log(`❌ In-Memory DB Error: ${memError.message}`);
      console.log(`========================================\n`);
    }
  }
};

module.exports = connectDB;
