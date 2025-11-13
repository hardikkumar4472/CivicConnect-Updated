export default function initSockets(io) {
  io.on("connection", (socket) => {
    console.log("New WebSocket connection:", socket.id);

    // Example test event
    socket.on("ping", (data) => {
      console.log("Ping from client:", data);
      socket.emit("pong", "Pong from server! 🏓");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
