import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import { io, server, app } from './lib/socket.js';


dotenv.config();

// Connect to database
connectDB();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;


app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    //origin: [FRONTEND_URL, 'http://localhost:5173'],
    origin: "*",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);



app.get('/', (req, res) => {
    return res.end("Hello World");
})



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})