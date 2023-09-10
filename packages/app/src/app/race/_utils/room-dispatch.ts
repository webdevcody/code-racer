import { socket } from "@/lib/socket";
import { RACE_STATUS } from "@code-racer/wss/src/consts";
import { z } from "zod";

const participantInformationSchema = z.object({
  userID: z.string(),
  displayName: z.string(),
  displayImage: z.string()
});

const gameStatusSchema = z.union([
  z.literal(RACE_STATUS.WAITING),
  z.literal(RACE_STATUS.COUNTDOWN),
  z.literal(RACE_STATUS.RUNNING),
  z.literal(RACE_STATUS.FINISHED)
]);

const listOfPlayersSchema = z.array(participantInformationSchema);

const RoomDispatchStateSchema = z.object({
  gameStatus: gameStatusSchema,
  listOfPlayers: listOfPlayersSchema,
  shouldRenderRoom: z.boolean(),
  isSocketConnected: z.boolean(),
  roomOwnerID: z.string(),
});

const RoomDispatchActionsSchema = z.object({
  type: z.union([
    z.literal("change_game_status"),
    z.literal("change_list_of_players"),
    z.literal("change_should_render_room"),
    z.literal("change_socket_connection_state"),
    z.literal("change_room_owner_id")
  ]),
  payload: z.union([
    gameStatusSchema,
    listOfPlayersSchema,
    z.string(),
    z.boolean()
  ])
});

export type RoomDispatchStateType = z.infer<typeof RoomDispatchStateSchema>
export type RoomDispatchActionType = z.infer<typeof RoomDispatchActionsSchema>

const throwError = (type: string) => {
  throw new Error(
    "Invalid action payload type for action type " +
    type +
    ". It must be a number."
  );
};

export const RoomDispatchInitialState: RoomDispatchStateType = {
  gameStatus: "waiting",
  listOfPlayers: [],
  shouldRenderRoom: false,
  isSocketConnected: socket.connected,
  roomOwnerID: ""
};

export const RoomDispatch = (
  state: RoomDispatchStateType,
  action: RoomDispatchActionType,
) => {
  switch (action.type) {
    case "change_game_status":
      state.gameStatus = gameStatusSchema.parse(action.payload);
      break;
    case "change_list_of_players":
      state.listOfPlayers = listOfPlayersSchema.parse(action.payload);
      break;
    case "change_room_owner_id":
      if (typeof action.payload !== "string") {
        throwError(action.type);
        break;
      };
      state.roomOwnerID = action.payload;
      break;
    case "change_should_render_room":
      if (typeof action.payload !== "boolean") {
        throwError(action.type);
        break;
      }
      state.shouldRenderRoom = action.payload;
      break;
    case "change_socket_connection_state":
      if (typeof action.payload !== "boolean") {
        throwError(action.type);
        break;
      }
      state.isSocketConnected = action.payload;
      break;
  }
  return {
    gameStatus: state.gameStatus,
    listOfPlayers: state.listOfPlayers,
    roomOwnerID: state.roomOwnerID,
    shouldRenderRoom: state.shouldRenderRoom,
    isSocketConnected: state.isSocketConnected
  } satisfies RoomDispatchStateType;
};