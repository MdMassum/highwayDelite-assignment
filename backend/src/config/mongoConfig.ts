import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async () => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      console.log("MongoDB Connected Successfully!");
      return;
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}):`, error);

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

      } else {
        console.error("All MongoDB connection attempts failed. Exiting...");
        process.exit(1);
      }
    }
  }
};

export default connectDB;
