import { io } from "socket.io-client";

export const socket = io("https://civicconnect-backend.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});
