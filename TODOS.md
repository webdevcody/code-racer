# Current TODOS for Code Racer

- Move all websocket related information calls to the server since database calls and the like are still being invoked on the client. For example, we had an action that gets information about a participant's (multiplayer) name and image and it is called on the client. This is severe because first, we called them one by one on a useEffect, and second, we called them on the client when we could've called them on the server before the server sent the information to the client.

- Refactor the client that uses the websocket 'socket.io' (Practice proper cleanups, etc.)

- Refactor the websocket server to use the recommended approaches stated by socket.io, using of InMemoryState, etc.

- NOTE: Please do all database calls (for example, if you need a user's info) on the websocket server if you are going to need it for the multiplayer section. It's recommended looking up socket.io's documentations since they provide greate examples as well.

- And others...