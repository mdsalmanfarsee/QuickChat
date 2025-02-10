import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';


dotenv.config();
const app = express();
// Connect to database
connectDB();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);



app.get('/', (req, res) => {
    return res.end("Hello World");
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})