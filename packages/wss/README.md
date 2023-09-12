## Socket.io code-race server

Welcome the the README file for the websocket server! We used socket.io for this to work. The only time that a player will be connected is when they play multiplayer. This is an updated README file after refactoring the multiplayer lifecycle and room handling. As of this moment, everything is still a prototype and is not yet available in production.

The recent refactor uses a Linked List to handle all of the state to try and achieve a consistent way of handling the websocket server's state. All logic is written with Object Oriented Programming using classes. Please note that the current implementation temporarily stores all state in memory and gets removed upon user disconnection.

Throughout the lifecycle, the server can emit successes, errors or fails in tasks because of conditions such as, for example, a room is full of users. There is a wrapper for the overall wrapper for the layout of the rooms page that will catch these notifications and forcibly disconnect the user based on the title of the notification. The snippet is as follows:

```ts
    /** On the layout */
    const Layout: NextPage<{ children: React.ReactNode }> = ({ children }) => {
        return <NotificationCatcher>{children}</NotificationCatcher>;
    };

    /** On the NotificationCatcher component */

    "use client";

    import type { SendNotificationPayload } from "@code-racer/wss/src/events/server-to-client";

    import React from "react";

    import { toast } from "@/components/ui/use-toast";
    import { socket } from "@/lib/socket";
    import { useRouter } from "next/navigation";

    export const NotificationCatcher: React.FC<{ children: React.ReactNode }> = ({
    children,
    }) => {
    const router = useRouter();

    React.useEffect(() => {
        const showToast = ({
        title,
        description,
        variant,
        }: SendNotificationPayload) => {
        toast({
            title,
            description,
            variant,
            duration: 2000,
        });

        switch (title) {
            case "Error":
            case "Room Not Found":
            case "Room Full!":
            case "Race Has Started!":
            case "Server Full!":
            case "Room Is Not Accepting Players!":
            if (socket.connected) {
                socket.disconnect();
            }
            router.replace("/race/rooms");
            break;
        }
        };

        const handleError = (error: Error) => {
        showToast({
            title: error.name,
            description: error.message,
            variant: "destructive",
        });
        };

        socket.on("connect_error", handleError);
        socket.on("SendError", handleError);
        socket.on("SendNotification", showToast);
        /** To avoid memory leaks, we cleanup or destroy this
         *  event listener on component unmount.
         */
        return () => {
        socket.off("connect_error", handleError);
        socket.off("SendError", handleError);
        socket.off("SendNotification", showToast);
        };
    }, [children, router]);

    return children;
    };

```

The lifecycle is as follows:

### Lifecycle

1. When a player visits the page, "/race", they will see the card for creating or joining a room. There is a button with a text, "Go now!", that will redirect them to the page, "/race/rooms".
2. They will see two cards at this page. One gives them the ability to create a room and the other to join one.
3. Before a player connects to the server, a middleware will handle the client and the server's handshake. The snippet is as follows:

```ts
 private middleware(): void {
    /** We get all information about the user
     *  from the client to avoid doing database calls
     *  just to get their displayName and displayImage.
     */
    type MiddlewareAuth = {
        // Read further to know why the userID is optional.
        userID?: string,
        displayName: string,
        displayImage: string
    };
    /** To use this provided information,
     *  we attach it to the socket object provided
     *  to us by socket.io.
     *  
     *  However, TypeScript will give us errors since custom properties
     *  technically won't exist. To prevent this, we will do:
     */
    declare module "socket.io" {
        interface Socket {
            userID: string,
            displayName: string,
            displayImage: string
        }
    }
    /** The server instance is provided to us
     *  by socket.io.
     * 
     *  @see https://socket.io/docs/v4/middlewares/
     */
    this.server.use((socket, use) => {
        const auth = socket.handshake.auth as MiddlewareAuth;

        // Just in case it's accidentally or purposefully empty.
        if (!auth.displayName) {
            return next(new Error("Please provide a display nae"))
        }

        /** A logic to prevent authenticated users from joining the websocket server
         *  more than once.
         */
        if (auth.userID) {
            // The memory instance of the game server which handles all state.
            const foundUser = this.memory.findUserByID(auth.userID);

            if (foundUser) {
                return next(new Error("You are already connected."));
            }

            socket.userID = auth.userID;
        }  else {
           /** If the user is not connected, we use the socket's id that is automatically generated to us by socket.io. This is useful since the socket's id is also made available on the client. */
           socket.userID = socket.id;
        }

        /** For users not logged in,
         *  a fallback username and image is provided from the client.
         */
        socket.displayName = auth.displayName;
	    socket.displayImage = auth.displayImage;
		next();
    });
 };
```

4. After the middleware does its job and a user successfully connects, the server will receive the event, "connection", and the first thing we prompt the server to do is to save the user session in memory. The snippet is as follows:

```ts
    /** roomIDs is necessary
     *  for bookkeeping when the user disconnects.
     */
    this.memory.addUser({
		userID: socket.userID,
		displayImage: socket.displayImage,
		displayName: socket.displayName,
		roomIDs: new Array<string>(1).fill(socket.id),
	});
```

5. When a player creates a room, they will be connected to the server and the client will then emit to the websocket server the event, "CreateRoom".
6. This event will need two parameters, "userID" & "language". The server, upon receiving this event, will run checks and will not create a room if:
 - userID is not provided
 - The amount of rooms in memory >= the maximum amount of rooms specified as a constant in the server.
 - No snippet exists on the database for the chosen language.
 - If we fail to add the session of the user with the given userID.
7. If all checks pass, we will generate a random id, using "uuid", and push that generated roomID to the stored user session's list/array of roomIDs and join the socket on that roomID.
8. Then, since the participants, which hold all information about the users in the room, is also the same type of that responsible for storing user sessions, we just create a new instance of it for the created room. Below is an example snippet:

```ts
    const UserSessioMemoryForRoom = new UserSessionMemoryStore();

	const room = {
		snippet: {
			id: snippet.id,
			name: snippet.name,
			code: snippet.code,
			language,
		},
		createdAt: new Date(),
		roomOwnerID: userSession.userID,
		roomID,
		participants: UserSessioMemoryForRoom,
		gameStatus: RACE_STATUS.WAITING,
	} satisfies Room;
```

9. We then add the generated room object in the memory and emit to the server that it was a success and along with the roomID through the event, "SendRoomID".
10. Upon receiving the event, "SendRoomID", on the client, the user will then be redirected towars the page, "/race/rooms/`${roomID}`" by pushing this link to the browser's history stack with router.push().
11. Upon arriving on this page, we will get the roomID from the url params and the session of the user, using "getCurrentUser()", to see if they are logged in or not. All logic for the room handling, game, and such will be handled by the component name, "ClientRoom", and this shall receive two props:
 a. roomID
 b. session
12. On this component, we have a useEffect that will emit to the client the event, "CheckIfRoomIDExists".
12. Upon receiving the event, "CheckIfRoomIDExists", the server will do the following checks, and will not let the user join this room if:
 - No room exists in the memory with the provided roomID from the event.
 - The room currently has an amount of users >= the maximum amount of users a room can have.
 - The room's status is not waiting.
 - If the user's session was not stored in memory.
13. After passing all checks, the server will add the roomID to the user's session list of roomIDs and join the socket to that room. Then, the server will emit a notification and send the updated list of users in a room to the client to update the visuals.
14. There are rules as to when a user will disconnect from the room they are in. They are as follows:
 - When they refresh the page.
 - When the navigate away from the page.
15. If a user is alone in a room, and they disconnect, the room they are in will be removed, thus, they won't be able to rejoin that room. They must create a new one.
16. To be able to play, there must be more than one player in a room. If started with only one player, then the server will emit an error.
17. A user can start the game if they are the owner of the room.
18. The player that came after the owner will be the new owner if the owner disconnects from the room.
19. Upon starting a game by changing the status of the room, the client will emit to the server that the room's state should be in "countdown". The timer will then start on the client and upon reaching 0, the client
will emit to the server that the room should be "running" at this point.
20. During "countdown" and "running" states, if the client emits to the server that the game should have a state of "waiting" again, then the race will restart no matter what.
21. A client will emit this if the following conditions are met:
 - A player leaves the room and only one player will be left.
22. Upon the start of the race, the server will store the information of the race in memory again. The schema of this state is as follows:

```ts
    interface RunningGameInformation {
        roomID: string,
        participants: ParticipantMemoryStore(), // holds information such as position, cpm, etc.,
        startedAt: Date,
        endedAt: Date
    }
```

23. While on a race, the client will emit all information to the server. Then, the server will store this information, such as, timestamp, progress, etc., in memory.
24. When a user finishes finished the race before the others, the client will emit this to the server with the information regarding the time it took for them to finish therace. Then, they will see a realtime progress of the other competitors. Right now, the timestamp and progress can only be seen. A potential feature could be to show a replay of other players' currently types words.
25. The server will receive this event named, "SendUserHasFinished", and will check if, upon this user's finish, all users in the room have finished as well. If so, the server will change the status of the room to "finished" and emit this to the client.
26. Upon receiving this event, the client will be notified of this and render the component that shows the final results of the race as a table.
27. On this client, there is a useEffect that prompts the server to send all information about the finished game.
28. An owner can revert the state of the room back to "waiting" and play again.