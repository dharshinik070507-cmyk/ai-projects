import mongoose from "mongoose";

export async function connectDB() {
  console.log("Mongo URI:", process.env.MONGO_URI); // move log here

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("🍃 MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
