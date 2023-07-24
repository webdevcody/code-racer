## Socket.io code-race server

### Lifecycle

1. Players can connect to the game server through Socket.io.
2. When a player wants to enter a race, the server handles the player's request and adds them to the race. If the race is not already created, a new race is created, and the player is added as the first participant.
3. If the race already has participants, additional players are allowed to join until the maximum number of participants (MAX_PARTICIPANTS_PER_RACE) is reached. After this limit, the race is considered full, and no more players can join.
4. Once there are enough players in the race, a countdown starts (START_GAME_COUNTDOWN) to prepare for the race.
5. When the countdown reaches zero, the race officially starts, and the server emits the race state to all participants.
6. During the race, players send updates about their current typing progress (position) to the server. The server keeps track of the positions of all players.
7. The race continues until one of the players reaches the maximum position (GAME_MAX_POSITION), indicating that they have completed the race.
8. When the race finishes, the server emits the final race state to all participants, removes the race from the race map and marks the race as ended in the db.

### Functionalities:

- Players can enter and leave races.
- Races have a maximum capacity, and once full, no additional players can join.
- The server handles race countdown before the race starts.
- Players' positions are updated in real-time during the race.
- The server emits race state updates to all participants.
- Races are automatically ended when a player reaches the maximum position.

### Possible Vulnerabilities:

- RaceFullException Handling: The current implementation throws a custom "RaceFullException" when a player tries to join a full race. It is important to handle exceptions properly to prevent potential crashes or unexpected behavior.
- Race Status Manipulation: The race status (e.g., "waiting," "countdown," "running," "finished") is not strictly controlled, and it relies on the server to update the status. A malicious client could potentially manipulate the race status by sending false race updates or exploiting server-side issues.
- Race Deletion: The code doesn't seem to handle scenarios where a race might be unexpectedly deleted from the list, which could lead to unexpected behavior if participants are still present.
- Race Progression: The code currently updates players' positions based solely on the data received from the clients. This approach may be susceptible to cheating or hacking. Implementing server-side validation and logic for race progression could be beneficial.
- Data Persistence: The code does not include any data persistence, meaning that race data won't be saved between server restarts. Implementing data persistence could enhance the overall user experience and prevent data loss.
- Authentication & Authorization: Although Users can join races as guest users, the current implementation doesn't make sure the user can't join the same race multiple times.
- Game State Sync: In a real-world scenario, race state synchronization between the server and clients could face challenges like latency, packet loss, and network issues. Implementing a robust synchronization mechanism is vital to ensure fair gameplay for all participants.

### Some implementation details:

```typescript
export class Game {
    // ...
    private activeCountdowns = new Map<Race["id"], Promise<void>>();
    // ...
```

The activeCountdowns map is an instance variable within the Game class. It is defined as a Map data structure, which associates a Race["id"] (the unique identifier for a race) with a Promise<void>.

#### Purpose:

The primary purpose of the activeCountdowns map is to keep track of the ongoing countdowns for different races in the game. When a race is about to start, a countdown is initiated, and this map is used to ensure that multiple countdowns for the same race do not overlap.
