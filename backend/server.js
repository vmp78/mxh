import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from "./routes/messageRoutes.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config(); // to read .env file

connectDB();

const app = express(); // create express server

const PORT = process.env.PORT || 5000; // backup the port with 5000 if PORT is not specified in the config

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ limit: '50mb' })); // parse json data in req.body
app.use(express.urlencoded({ extended: true })); // parse form data in req.body
app.use(cookieParser()); // to access cookie

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log(`server started at http://localhost:${PORT} heyy`));
