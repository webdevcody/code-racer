import type { ClientToServerEvents } from "@code-racer/wss/src/events/client-to-server";
import type { ServerToClientEvents } from "@code-racer/wss/src/events/server-to-client";
import type { Socket } from "socket.io-client";

import { io } from "socket.io-client";

/** Declare this in one place. This type exists on server as well. */
type MiddlewareAuth = {
  userID: string | null | undefined;
  displayName: string;
  displayImage: string;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_WSS_URL ?? "http://localhost:3001",
  { transports: ["websocket"], autoConnect: false },
);

export const connectToSocket = (authDetails: MiddlewareAuth) => {
  socket.auth = authDetails;
  socket.connect();
};