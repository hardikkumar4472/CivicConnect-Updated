import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import initSockets from "./socket/index.js"; // ⬅ NEW

dotenv.config();

// Create HTTP server manually
const server = http.createServer(app);

// Attach socket.io to server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://civicconnect-nfew.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket logic
initSockets(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔌 WebSockets Enabled (Socket.IO connected)");
});
