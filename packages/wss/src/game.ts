import type { Server } from "socket.io";
import type { ClientToServerEvents } from "./events/client-to-server";
import type { ServerToClientEvents } from "./events/server-to-client";

import { v4 as uuidv4 } from "uuid";

import type { Language } from "@code-racer/app/src/config/languages";

declare module "socket.io" {
	interface Socket {
		userID: string;
		displayName: string;
		displayImage: string;
	}
}
