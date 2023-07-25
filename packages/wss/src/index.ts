import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Game } from "./game";

const PORT = process.env.PORT

if (!PORT) { 
  throw new Error("Expected process.env.PORT to have been set, but it was not")
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


new Game(io);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
