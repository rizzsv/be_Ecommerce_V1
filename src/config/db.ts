import mongoose from "mongoose";


export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("MongoDB is Ready!");
    } catch (error) {
        console.log("MongoDB Connection Failed", error);
        process.exit(1)
    }
};