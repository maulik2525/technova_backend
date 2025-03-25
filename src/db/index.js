import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log(`Db connected Successfully :: ${dbInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDb Connection Error::", error);
    process.exit(1);
  }
};

export { connectDB };
