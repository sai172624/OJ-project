import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const dbConnection = async () => {
    const MONGO_URL = process.env.MONGO_URL;

    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.log("❌ Error while connecting to database", error);
    }
};
