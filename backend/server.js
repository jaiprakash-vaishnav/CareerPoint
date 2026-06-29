import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postsRoute from "./routes/posts.route.js";
import userRoute from "./routes/user.route.js";
import ExpressError from "./utils/ExpressError.js";
import { wrapAsync }from "./utils/wrapAsync.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(postsRoute);
app.use(userRoute);
app.use(express.static("uploads"));

const PORT = process.env.PORT || 9090;
const MONGO_URL = process.env.MONGO_URL;


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    console.log(err.message);
    res.status(status).json({ message: message });
});

const start = async () => {
    const connectDb = await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

start();