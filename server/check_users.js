import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function main() {
  console.log("Connecting to:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("Connected successfully!");

  // Find collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  // Try to query the users collection
  const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  const users = await User.find({});
  console.log("Number of users in DB:", users.length);
  for (const u of users) {
    console.log(`- Email: ${u.get('email')}, Role: ${u.get('role')}, Name: ${u.get('name')}, isFirstLogin: ${u.get('isFirstLogin')}`);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
