import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import { Game } from "./game";
const io = new Server(server);

new Game(io);

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
