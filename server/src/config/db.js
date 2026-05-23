import mongoose from "mongoose";
import "dotenv/config";
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI || 'mongodb://127.0.0.1:27017/DINESH';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

     console.log("db connected successfully");
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
