import type { Server } from "socket.io";
import type { ClientToServerEvents } from "./events/client-to-server";
import type { ServerToClientEvents } from "./events/server-to-client";
import type { Race } from "@code-racer/app/src/lib/prisma";

import { GAME_CONFIG, IS_IN_DEVELOPMENT, RACE_STATUS, type RaceStatus } from "./consts";
import { getRandomSnippet } from "@code-racer/app/src/app/race/(play)/loaders";
import { v4 as uuidv4 } from "uuid";

declare module "socket.io" {
  interface Socket {
    userID: string;
    displayName: string;
    displayImage: string;
  }
}

type MiddlewareAuth = {
  userID?: string;
  displayName: string;
  displayImage: string;
}

type UserSession = {
  userID: string;
  displayName: string;
  displayImage: string;
  roomIDs: Array<string>;
}

export type ParticipantInformation = {
  userID: string;
  displayName: string;
  displayImage: string;
}

export type Participant = {
  userID: string;
  progress: number;

  isFinished: boolean;

  /** Time taken in seconds */
  timeTaken: number;
}

type Room = {
  participants: UserSessionMemory;
  roomOwnerID: string;
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

export class UserSessionMemory implements LinkedListInterface<UserSession> {
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

    if (this.head && !this.head.next) {
      this.head.next = this.tail;
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
      if (previousNode.next === this.tail) {
        previousNode.next = undefined;
        this.tail = previousNode;
      } else {
        previousNode.next = currentNode.next;
      }
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

  getAllUsers(): Array<ParticipantInformation> {
    let currentNode = this.head;
    const arrayOfUsers = new Array<ParticipantInformation>();

    for (let idx = 0; currentNode && idx < this.length; ++idx) {
      arrayOfUsers.push({
        userID: currentNode.value.userID,
        displayImage: currentNode.value.displayImage,
        displayName: currentNode.value.displayName
      });
      currentNode = currentNode.next;
    }

    return arrayOfUsers;
  }

  private getNode(item: UserSession | string): Node<UserSession> | undefined {
    let currentNode = this.head;
    for (let idx = 0; currentNode && idx < this.length; ++idx) {
      if (typeof item == "string") {
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

  remove(item: Room | string): Node<Room> | undefined {
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
        if (currentNode.value.roomID === item) {
          break;
        }
      } else {
        if (currentNode.value.roomID === item.roomID) {
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
  private rooms: RoomMemory;
  private userSessions: UserSessionMemory;

  constructor() {
    this.rooms = new RoomMemory();
    this.userSessions = new UserSessionMemory();
  }

  addUser(userSession: UserSession): void {
    this.userSessions.append(userSession);
  }

  findUser(userID: string | UserSession): UserSession | undefined {
    return this.userSessions.get(userID)?.value;
  }

  removeUser(userID: string): UserSession | undefined {
    return this.userSessions.remove(userID)?.value;
  }

  addRoom(room: Room): void {
    this.rooms.append(room);
  }

  findRoom(roomID: Room | string): Room | undefined {
    return this.rooms.get(roomID)?.value;
  }

  removeRoom(roomID: Room | string): Room | undefined {
    return this.rooms.remove(roomID)?.value;
  }

  addUserSessionToRoom(roomID: string, userSession: UserSession): Room | undefined {
    const room = this.rooms.get(roomID)?.value
    room?.participants.append(userSession);
    return room;
  }

  removeUserSessionFromRoom(roomID: string, userSession: UserSession | string): Room | undefined {
    const room = this.rooms.get(roomID)?.value;
    if (room) {
      room?.participants.remove(userSession);
      const ROOM_IS_EMPTY = room?.participants.length === 0;
      if (ROOM_IS_EMPTY) {
        this.removeRoom(room);
      }
    }
    return room;
  }

};

export class Game {
  private readonly START_GAME_COUNTDOWN = GAME_CONFIG.START_GAME_COUNTDOWN;
  private readonly MAX_PARTICIPANTS_PER_RACE = GAME_CONFIG.MAX_PARTICIPANTS_PER_RACE;
  private readonly GAME_LOOP_INTERVAL = GAME_CONFIG.GAME_LOOP_INTERVAL;
  private readonly GAME_MAX_POSITION = GAME_CONFIG.GAME_MAX_POSITION;

  private server: Server<ClientToServerEvents, ServerToClientEvents>;

  private Memory = new Memory();

  constructor(
    server: Server<ClientToServerEvents, ServerToClientEvents>
  ) {
    this.server = server;

    this.initializeGame();
  }

  private initializeGame() {
    this.middleware();

    this.server.on("connection", (socket) => {
      if (IS_IN_DEVELOPMENT) {
        console.log("User has connected.");
        // socket.emit("SendNotification", {
        //   title: "User has connected"
        // });
      }

      const session = {
        userID: socket.userID,
        displayImage: socket.displayImage,
        displayName: socket.displayName,
        roomIDs: new Array<string>(1).fill(socket.id)
      } as UserSession;

      this.Memory.addUser(session);

      console.log(this.Memory);

      socket.on("disconnect", (_reason) => {
        if (IS_IN_DEVELOPMENT) {
          console.log("User is disconnecting");
        }
        const roomsUserIsIn = this.Memory.findUser(socket.userID)?.roomIDs
        if (!roomsUserIsIn) {
          this.Memory.removeUser(socket.userID);
          return;
        }

        roomsUserIsIn.forEach((roomID) => {
          if (roomID === socket.id) {
            return;
          }
          const ROOM_EXISTS = this.Memory.removeUserSessionFromRoom(roomID, socket.userID);

          if (ROOM_EXISTS) {

            const firstParticipant = ROOM_EXISTS.participants.getItemAt(0);

            if (firstParticipant) {
              ROOM_EXISTS.roomOwnerID = firstParticipant.value.userID;
              this.server.to(roomID).emit("SendRoomOwnerID", ROOM_EXISTS.roomOwnerID);
            }

            this.server.to(roomID).emit("PlayerJoinedOrLeftRoom", ROOM_EXISTS.participants.getAllUsers());
          }
          socket.to(roomID).emit("SendNotification", {
            title: "Someone left!",
            description: socket.displayName + " has left the room!"
          });
        });

        this.Memory.removeUser(socket.userID);
      });

      socket.on("CreateRoom", async ({ userID, language }) => {
        if (!userID) {
          console.warn("userID is not provided! Please provide it to create a room.");
          return;
        }

        socket.emit("SendNotification", {
          title: "Creating Room",
          description: "Your room is being created...",
        });

        const snippet = await getRandomSnippet({ language });

        if (!snippet) {
          socket.emit("SendNotification", {
            title: "Failed to create room",
            description: "There is no available snippet for the language you've chosen. Please try creating one.",
            variant: "destructive"
          });
          return;
        }

        const roomID = uuidv4();

        const userSession = this.Memory.findUser(userID);

        if (!userSession) {
          if (IS_IN_DEVELOPMENT) {
            console.error("Error in managing memory. User does not exist in memory.");
          }
          socket.emit("SendError", new Error("Failed to create room. Please try again or submit an issue on GitHub."));
          return;
        }

        userSession.roomIDs.push(roomID);
        socket.join(roomID);
        const UserSessioMemoryForRoom = new UserSessionMemory();
        UserSessioMemoryForRoom.append(userSession);
        const room = {
          race: {
            id: roomID,
            snippetId: snippet.id,
            startedAt: null,
            endedAt: null,
            createdAt: new Date()
          },
          roomOwnerID: userSession.userID,
          roomID,
          participants: UserSessioMemoryForRoom,
          gameStatus: RACE_STATUS.WAITING
        };

        this.Memory.addRoom(room);

        socket.emit("SendNotification", {
          title: "Room Created",
          description: "Success! Your room has been created."
        });
        socket.emit("SendRoomID", {
          roomID,
          roomOwnerID: room.roomOwnerID
        });
      });

      socket.on("CheckIfRoomIDExists", (roomID) => {
        const foundRoom = this.Memory.findRoom(roomID);
        if (!foundRoom) {
          socket.emit("SendNotification", {
            title: "Room Not Found",
            description: "The room ID does not exist. Perhaps it is yet to be created or it got deleted? Try creating a new one.",
            variant: "destructive"
          });
          return;
        }

        if (foundRoom.participants.length >= this.MAX_PARTICIPANTS_PER_RACE) {
          socket.emit("SendNotification", {
            title: "Room Full!",
            description: `This room is full of participants. The current maximum players is ${this.MAX_PARTICIPANTS_PER_RACE} Try creating a new one.`,
            variant: "destructive"
          });
          return;
        }

        if (foundRoom.gameStatus === RACE_STATUS.RUNNING) {
          socket.emit("SendNotification", {
            title: "Race Has Started!",
            description: "The race for this room has already started. Please try creating a new one.",
          });
          return;
        }

        /** This means that the user who's joining was the one
         *  that created the room.
         */
        const USER_JOINED_THE_ROOM_ALREADY = foundRoom.participants.get(socket.userID);
        if (USER_JOINED_THE_ROOM_ALREADY) {
          socket.emit("SendRoomID", {
            roomID,
            roomOwnerID: foundRoom.roomOwnerID
          });
          /** Since we call the event, "CheckIfRoomIDExists" when a user
           *  is in a [roomID] page, we just emit the amount of participants
           *  since we also call this event when a user creates a room.
           *  This is because the "CreateRoom" event already adds the user to the list of participants of the
           *  created room.
           */
          this.server.to(roomID).emit("PlayerJoinedOrLeftRoom", foundRoom.participants.getAllUsers());
          return;
        }
        const userSession = this.Memory.findUser(socket.userID);

        if (!userSession) {
          if (IS_IN_DEVELOPMENT) {
            console.warn("Memory handling error. User session is not in memory despite them connecting to the server.");
          }
          return;
        }

        const USER_HAVE_NOT_JOINED_YET = !socket.rooms.has(roomID);
        if (USER_HAVE_NOT_JOINED_YET) {
          socket.join(roomID);
          userSession.roomIDs.push(roomID);
        }

        foundRoom.participants.append(userSession);

        this.server.to(roomID).emit("PlayerJoinedOrLeftRoom", foundRoom.participants.getAllUsers());

        socket.emit("SendRoomID", {
          roomID,
          roomOwnerID: foundRoom.roomOwnerID
        });
        socket.to(roomID).emit("SendNotification", {
          title: "Someone joined!",
          description: socket.displayName + " has joined the room!",
          variant: "middle"
        });
      });


      socket.on("CheckGameStatusOfRoom", (roomID) => {
        const foundRoom = this.Memory.findRoom(roomID);

        if (!foundRoom) {
          if (IS_IN_DEVELOPMENT) {
            console.warn("The room ID provided by CheckGameStatusOfRoom does not exist. This is a memory handling error since the room should exist.");
          }
          return;
        }

        this.server.to(roomID).emit("SendGameStatusOfRoom", foundRoom.gameStatus);
      });

      socket.on("ChangeGameStatusOfRoom", ({ roomID, raceStatus }) => {
        const foundRoom = this.Memory.findRoom(roomID);
        if (!foundRoom) {
          if (IS_IN_DEVELOPMENT) {
            console.warn("Memory handling error. Trying to change the status of a room, but it does not exist in memory. Perhaps the roomID provided was wrong?");
          }
          socket.emit("SendError", new Error("Failed to change the state of the room. Please try again or create a new room."));
          return;
        }

        const STARTING_GAME = foundRoom.gameStatus === RACE_STATUS.WAITING && raceStatus === RACE_STATUS.RUNNING;

        if (STARTING_GAME && foundRoom.participants.length <= 1) {
          socket.emit("SendError", new Error("Cannot start a multiplayer race with only one player."));
          return;
        } 
        
        const RESETTING_GAME = foundRoom.gameStatus !== RACE_STATUS.WAITING && raceStatus === RACE_STATUS.WAITING;
        if (RESETTING_GAME) {
          this.server.to(roomID).emit("SendNotification", {
            title: "Resetting Game",
            description: "Resetting the game since you are the only player left."
          });
        }

        foundRoom.gameStatus = raceStatus;

        this.server.to(roomID).emit("SendGameStatusOfRoom", foundRoom.gameStatus);
      });
    });
  }

  private middleware() {
    this.server.use((socket, next) => {
      const auth = socket.handshake.auth as MiddlewareAuth;
      if (!auth.displayName) {
        return next(new Error("Please provide a display name."));
      }

      if (auth.userID) {
        socket.userID = auth.userID;
        const foundUser = this.Memory.findUser(socket.userID);

        if (foundUser) {
          return next(new Error("Your account is already connected to our websocket server. Please disconnect your connected account or use a different browser."));
        }
      } else {
        socket.userID = socket.id;
      }

      socket.displayName = auth.displayName;
      socket.displayImage = auth.displayImage;
      next();
    });
  }

};