import { io } from "socket.io-client";
import type { ClientToServerEvents } from "@code-racer/wss/src/events/client-to-server";
import type { ServerToClientEvents } from "@code-racer/wss/src/events/server-to-client";
import type { Socket } from "socket.io-client";
import { env } from "@/env.mjs";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  env.NEXT_PUBLIC_WSS_URL,
  { transports: ["websocket"], autoConnect: false },
);