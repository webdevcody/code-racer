import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Game } from "./game";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT ?? 3001;

new Game(io);

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
