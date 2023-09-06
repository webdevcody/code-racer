import type { Server } from "socket.io";
import type { ClientToServerEvents } from "./events/client-to-server";
import type { ServerToClientEvents } from "./events/server-to-client";
import type { Race } from "@code-racer/app/src/lib/prisma";

import { GAME_CONFIG, IS_IN_DEVELOPMENT, type RaceStatus } from "./consts";

declare module "socket.io" {
  interface Socket {
    displayName: string;
    displayImage: string;
  }
}

type MiddlewareAuth = {
  displayName: string;
  displayImage: string;
}

type UserSession = {
  userID: string;
  displayName: string;
  displayImage: string;
  roomIDs: Array<string>;
}

type Room = {
  participants: UserSessionMemory;
  roomID: string;
  race: Race;
  gameStatus: RaceStatus;
}

type Node<T> = {
  value: T;
  next: Node<T> | undefined;
}

interface LinkedListInterface<T> {
  length: number;
  append(_item: T): void;
  prepend(_item: T): void;
  remove(_item: T): Node<T> | undefined;
  get(_item: T): Node<T> | undefined;
  getItemAt(_idx: number): Node<T> | undefined;
}

class UserSessionMemory implements LinkedListInterface<UserSession> {
  public length: number;
  private head: Node<UserSession> | undefined;
  private tail: Node<UserSession> | undefined;

  constructor() {
    this.length = 0;
    this.head = undefined;
    this.tail = undefined;
  }

  append(item: UserSession): void {
    const node = { value: item } as Node<UserSession>;

    this.length = this.length + 1;

    if (!this.tail) {
      this.head = node;
      this.tail = node;
      return;
    }

    this.tail.next = node;
    this.tail = node;
  }

  prepend(item: UserSession): void {
    const node = { value: item } as Node<UserSession>;

    this.length = this.length + 1;

    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }

    node.next = this.head;
    this.head = node;
  }

  remove(item: UserSession | string): Node<UserSession> | undefined {
    if (this.length === 1) {
      this.length = this.length - 1;
      this.tail = undefined;
      this.head = undefined;
      return;
    }

    let currentNode = this.head;
    let previousNode = undefined;

    for (let idx = 0; currentNode && idx < this.length; ++idx) {
      if (typeof item === "string") {
        if (currentNode.value.userID === item) {
          break;
        }
      } else {
        if (currentNode.value.userID === item.userID) {
          break;
        }
      }
      previousNode = currentNode;
      currentNode = currentNode.next;
    }

    if (!currentNode) {
      return undefined;
    }
    this.length = this.length - 1;
    if (currentNode === this.head) {
      this.head = currentNode.next;
      return;
    }

    if (previousNode) {
      previousNode.next = currentNode.next;
      return currentNode;
    }
  }

  removeUserWithUserID(userID: string): UserSession | undefined {
    return this.remove(userID)?.value;
  }

  get(item: UserSession | string): Node<UserSession> | undefined {
    return this.getNode(item);
  }

  getItemAt(idx: number): Node<UserSession> | undefined {
    if (idx >= this.length) {
      return undefined;
    }
    let currentNode = this.head;
    for (let i = 0; currentNode && i < idx; ++i) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }

  private getNode(item: UserSession | string): Node<UserSession> | undefined {
    let currentNode = this.head;
    for (let idx = 0; currentNode && idx < this.length; ++idx) {
      if (typeof item === "string") {
        if (currentNode.value.userID === item) {
          break;
        }
      } else {
        if (currentNode.value.userID === item.userID) {
          break;
        }
      }
      currentNode = currentNode.next;
    }
    return currentNode;
  }
}

class RoomMemory implements LinkedListInterface<Room> {
  public length: number;
  private head: Node<Room> | undefined;
  private tail: Node<Room> | undefined;

  constructor() {
    this.length = 0;
    this.head = undefined;
    this.tail = undefined;
  }

  append(item: Room): void {
    const node = { value: item } as Node<Room>;

    this.length = this.length + 1;

    if (!this.tail) {
      this.head = node;
      this.tail = node;
      return;
    }

    this.tail.next = node;
    this.tail = node;
  }

  prepend(item: Room): void {
    const node = { value: item } as Node<Room>;

    this.length = this.length + 1;

    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }

    node.next = this.head;
    this.head = node;
  }

  remove(item: Room): Node<Room> | undefined {
    let currentNode = this.head;
    let previousNode = undefined;
    for (let idx = 0; currentNode && idx < this.length; ++idx) {
      if (currentNode.value.roomID === item.roomID) {
        break;
      }
      previousNode = currentNode;
      currentNode = currentNode.next;
    }

    if (!currentNode) {
      return undefined;
    }
    this.length = this.length - 1;
    if (previousNode) {
      previousNode.next = currentNode.next;
      return currentNode;
    }

    if (currentNode === this.head) {
      this.head = currentNode.next;
    }
  }

  get(item: Room | string): Node<Room> | undefined {
    return this.getNode(item);
  }

  getItemAt(idx: number): Node<Room> | undefined {
    if (idx >= this.length) {
      return undefined;
    }
    let currentNode = this.head;
    for (let i = 0; currentNode && i < idx; ++i) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }

  private getNode(item: Room | string): Node<Room> | undefined {
    let currentNode = this.head;
    for (let idx = 0; currentNode && idx < this.length; ++idx) {
      if (typeof item === "string") {
        if (currentNode.value.roomID === item) {
          break;
        }
      } else {
        if (currentNode.value.roomID === item.roomID) {
          break;
        }
      }
      currentNode = currentNode.next;
    }
    return currentNode;
  }
}

class Memory {
  public length: number;
  private rooms: RoomMemory;
  private userSessions: UserSessionMemory;

  constructor() {
    this.length = 0;

    this.rooms = new RoomMemory();
    this.userSessions = new UserSessionMemory();
  }

  addUser(userSession: UserSession): void {
    this.userSessions.append(userSession);
  }

  findUser(userID: string): UserSession | undefined {
    return this.userSessions.get(userID)?.value;
  }

  removeUser(userID: string): UserSession | undefined {
    return this.userSessions.remove(userID)?.value;
  }

  addRoom(room: Room): void {
    this.rooms.append(room);
  }

  addUserSessionToRoom(roomID: string, userSession: UserSession): Room | undefined {
    const room = this.rooms.get(roomID)?.value
    room?.participants.append(userSession);
    return room;
  }

  removeUserSessionToRoom(roomID: string, userSession: UserSession): Room | undefined {
    const room = this.rooms.get(roomID)?.value;
    room?.participants.remove(userSession);
    return room;
  }

};

export class Game {
  private readonly START_GAME_COUNTDOWN: number;
  private readonly MAX_PARTICIPANTS_PER_RACE: number;
  private readonly GAME_LOOP_INTERVAL: number;
  private readonly GAME_MAX_POSITION: number;

  private server: Server<ClientToServerEvents, ServerToClientEvents>;

  private Memory: Memory;

  constructor(
    server: Server<ClientToServerEvents, ServerToClientEvents>
  ) {
    this.server = server;

    this.START_GAME_COUNTDOWN = GAME_CONFIG.START_GAME_COUNTDOWN;
    this.MAX_PARTICIPANTS_PER_RACE = GAME_CONFIG.MAX_PARTICIPANTS_PER_RACE;
    this.GAME_LOOP_INTERVAL = GAME_CONFIG.GAME_LOOP_INTERVAL;
    this.GAME_MAX_POSITION = GAME_CONFIG.GAME_MAX_POSITION;

    this.Memory = new Memory();

    this.initializeGame();
  }

  private initializeGame() {
    this.middleware();

    this.server.on("connection", (socket) => {
      if (IS_IN_DEVELOPMENT) {
        console.log("User has connected.");
      }

      const session = {
        userID: socket.id,
        displayImage: socket.displayImage,
        displayName: socket.displayName,
        roomIDs: new Array<string>()
      } as UserSession;

      this.Memory.addUser(session);

      console.log(this.Memory);

      socket.on("disconnecting", (_reason) => {
        if (IS_IN_DEVELOPMENT) {
          console.log("User is disconnecting");
        }
        this.Memory.removeUser(socket.id);
        console.log("--- AFTER REMOVING USER SESSION ---");
        console.log(this.Memory);
      });

      
    });
  }

  private middleware() {
    this.server.use((socket, next) => {
      const auth = socket.handshake.auth as MiddlewareAuth;
      if (!auth.displayName) {
        return next(new Error("Please provide a display name."));
      }

      socket.displayName = auth.displayName;
      socket.displayImage = auth.displayImage;
      next();
    });
  }

};