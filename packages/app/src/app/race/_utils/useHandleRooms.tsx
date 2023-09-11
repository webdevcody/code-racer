"use client";

import type { RoomProps } from "../rooms/page";
import type { SendRoomIDPayload } from "@code-racer/wss/src/events/server-to-client";
import type { ParticipantInformation } from "@code-racer/wss/src/store/types";
import { type RaceStatus } from "@code-racer/wss/src/consts";

import React from "react";
import { useSearchParams } from "next/navigation";

import { RoomDispatch, RoomDispatchInitialState } from "./room-dispatch";
import { connectToSocket, socket } from "@/lib/socket";
import { FALLBACK_IMG, RANDOM_USERNAME } from "@/config/consts";

type Props = {
  roomID: string;
} & RoomProps;

/** Responsible for
 *  communicating with the websocket server
 *  about room handling.
 */
const useHandleRooms = ({ session, roomID }: Props) => {
  const [state, dispatch] = React.useReducer(
    RoomDispatch,
    RoomDispatchInitialState
  );

  const searchParams = useSearchParams();

  const IS_PLAYER_CURRENT_USER = React.useMemo(
    () => session?.id === state.roomOwnerID || socket.id === state.roomOwnerID,
    [session?.id, state.roomOwnerID]
  );

  const changeRoomOwnerID = React.useCallback((roomOwnerID: string) => {
    dispatch({
      type: "change_room_owner_id",
      payload: roomOwnerID,
    });
  }, []);

  const handleRoomIDVerified = React.useCallback(
    ({ roomOwnerID }: SendRoomIDPayload) => {
      changeRoomOwnerID(roomOwnerID);
      dispatch({
        type: "change_should_render_room",
        payload: true,
      });
    },
    [changeRoomOwnerID]
  );

  const changeGameStatus = React.useCallback(
    (status: RaceStatus) => {
      socket.emit("ChangeGameStatusOfRoom", {
        roomID,
        raceStatus: status,
      });
    },
    [roomID]
  );

  const handleSendGameStatus = React.useCallback((status: RaceStatus) => {
    dispatch({
      type: "change_game_status",
      payload: status,
    });
  }, []);

  const handlePlayerJoinedOrLeftRoom = React.useCallback(
    (players: Array<ParticipantInformation>) => {
      if (roomID) {
        /** Let the owner manually change the state of the room to wating if the game in a room finished */
        const GAME_STARTED_AND_PLAYERS_LEFT_WITH_ONE_PLAYER_REMAINING =
          players.length <= 1 && state.gameStatus !== "waiting" && state.gameStatus !== "finished";

        if (GAME_STARTED_AND_PLAYERS_LEFT_WITH_ONE_PLAYER_REMAINING) {
          changeGameStatus("waiting");
        }

        dispatch({
          type: "change_list_of_players",
          payload: players,
        });
      }
    },
    [state.gameStatus, roomID, changeGameStatus]
  );

  React.useEffect(() => {
    if (!state.isSocketConnected) {
      const displayName = searchParams.get("displayName");
      connectToSocket({
        userID: session?.id,
        displayImage: session?.image ?? FALLBACK_IMG,
        displayName: displayName ?? session?.name ?? RANDOM_USERNAME,
      });
      dispatch({ type: "change_socket_connection_state", payload: true });
    }

    if (state.isSocketConnected && state.gameStatus === "waiting") {
      socket.emit("CheckIfRoomIDExists", roomID);
    }

    socket.on("PlayerJoinedOrLeftRoom", handlePlayerJoinedOrLeftRoom);
    socket.on("SendRoomID", handleRoomIDVerified);
    socket.on("SendRoomOwnerID", changeRoomOwnerID);

    return () => {
      socket.off("PlayerJoinedOrLeftRoom", handlePlayerJoinedOrLeftRoom);
      socket.off("SendRoomID", handleRoomIDVerified);
      socket.off("SendRoomOwnerID", changeRoomOwnerID);
    };
  }, [
    state.isSocketConnected,
    searchParams,
    session,
    roomID,
    state.gameStatus,
    handlePlayerJoinedOrLeftRoom,
    handleRoomIDVerified,
    changeRoomOwnerID,
  ]);

  React.useEffect(() => {
    socket.on("SendGameStatusOfRoom", handleSendGameStatus);
    return () => {
      socket.off("SendGameStatusOfRoom", handleSendGameStatus);
    };
  }, [handleSendGameStatus]);

  return {
    state,
    IS_PLAYER_CURRENT_USER,
    changeGameStatus,
  };
};

export { useHandleRooms };
