import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function main() {
  await mongoose.connect(MONGO_URI);

  const Permission = mongoose.model("Permission", new mongoose.Schema({}, { strict: false }));
  const perm = await Permission.findOne({});
  console.log("Permission Document:", JSON.stringify(perm, null, 2));

  await mongoose.disconnect();
}

main().catch(console.error);
