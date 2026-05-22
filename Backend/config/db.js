import mongoose from 'mongoose'
import env from "dotenv"
env.config()


const connectDB = async () => {

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb is connnected");
    
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }


};


export default connectDB;