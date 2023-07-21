"use client";

import React from "react";
import { type Socket, io } from "socket.io-client";

let socket: Socket;

async function getSocketConnection() {
    if (socket) return;

    await fetch("/api/socket");
    socket = io(undefined, {
        path: "/api/socket_io",
    });
    socket.on("connect", () => {
        console.log("connected");
    });
    console.log({ socket });
}

export default function TestPage() {
    React.useEffect(() => {
        getSocketConnection();
    }, []);
    return <div>Connection test</div>;
}
