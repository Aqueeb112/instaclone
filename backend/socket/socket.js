import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
export const getReciverSocketId = (reciverId) => userSocketMap[reciverId]

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected Userid = ${userId}, sockedId = ${socket.id}`);
  }

  socket.emit('getOnlineUser', Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    console.log(
      `User disconnedted Userid = ${userId}, sockedId = ${socket.id}`
    );
     socket.emit('getOnlineUser', Object.keys(userSocketMap))
  });
});


export {app,server,io}