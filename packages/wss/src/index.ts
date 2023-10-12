import { config } from "dotenv";
config();

import express from "express";
import http from "http";
import { Server } from "socket.io";

import { ClientToServerEvents } from "./events/client-to-server";
import { ServerToClientEvents } from "./events/server-to-client";
import TypingGame from "./game";

const PORT = process.env.PORT;

if (!PORT) {
	throw new Error(
		"Expected process.env.PORT to have been set, but it was not. Please write make a .env file.",
	);
}

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
	cors: {
		origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const game = new TypingGame(io);
game.initializeGame();

server.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});
