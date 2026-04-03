import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
} 
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "deepseek",
    }).then((mongoose) => mongoose);
  }
try{
  cached.conn = await cached.promise;
}
catch(error){
   cached.promise = null; // reset promise on failure
    console.log("Error connecting to MongoDb:",error);
    throw error;
}
  return cached.conn;
}

export default connectDB;