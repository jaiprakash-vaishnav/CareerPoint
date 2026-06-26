import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postsRoute from "./routes/posts.route.js";
import userRoute from "./routes/user.route.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(postsRoute);
app.use(userRoute);
const PORT = process.env.PORT || 9090;
const MONGO_URL = process.env.MONGO_URL;


const start = async () => {
    const connectDb = await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

start();