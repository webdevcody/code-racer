"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";

type WaitingScreenProps = {
  roomID: string;
  amountOfPlayers: number;
  IS_PLAYER_CURRENT_USER: boolean;
  handleResetGame: () => void;
};

const WaitingScreen: React.FC<WaitingScreenProps> = React.memo(
  ({ roomID, amountOfPlayers, IS_PLAYER_CURRENT_USER, handleResetGame }) => {
    return (
      <React.Fragment>
        <div className="mb-12">
          Room ID
          <div className="mt-2 flex justify-between items-center py-2 px-4 border-[1px] rounded-md bg-slate-200/20 dark:bg-black/20">
            {roomID}
            <CopyButton value={roomID} />
          </div>
        </div>

        {IS_PLAYER_CURRENT_USER && (
          <div>
            <span>You are the room owner of this room.</span>
            <Button
              className="mt-2 w-full"
              onClick={handleResetGame}
              disabled={amountOfPlayers < 2}
            >
              {amountOfPlayers > 1
                ? "Start Race"
                : "This room must have more than one player."}
            </Button>
          </div>
        )}

        {!IS_PLAYER_CURRENT_USER && (
          <div>Waiting for the room owner to start the race...</div>
        )}
      </React.Fragment>
    );
  }
);

WaitingScreen.displayName = "WaitingScreen";
export default WaitingScreen;