import { env } from "@/env.mjs";
import { Game } from "@/wss/game";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!env.MULTIPLAYER) return res.end();

  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if (res.socket.server.io) {
    // console.log("already running");
    res.end();
    return;
  }
  // console.log("starting socket.io");
  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const io = new Server(res.socket.server, {
    path: "/api/socket_io",
    addTrailingSlash: false,
  });
  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  res.socket.server.io = io;
  new Game(io);
  res.end();
}
