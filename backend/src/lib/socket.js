import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL;


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [FRONTEND_URL, "http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});


export function getRecieverSocketId(userId) {
    return userSocketMap[userId];
}


//used to store online users
const userSocketMap = {}; //{userId:socketId}


io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send message to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

});




export { io, app, server };