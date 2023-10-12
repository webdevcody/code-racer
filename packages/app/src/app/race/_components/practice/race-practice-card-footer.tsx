"use client";

import React from "react";

import { Button } from "@/components/ui/button";

type Props = {
  startTime: Date | undefined;
  totalTime: number;
  handleReset: () => void;
};

const RacePracticeCardFooter: React.FC<Props> = React.memo(
  ({ startTime, totalTime, handleReset }) => {
    return (
      <div className="flex items-center justify-between gap-x-8 gap-y-4 flex-wrap mt-4 px-4">
        {startTime && (
          <React.Fragment>
            <div className="text-sm lg:text-base">
              Elapsed time: {totalTime} seconds
            </div>

            <Button
              title="Reset Practice, Shortcut: (Escape)"
              aria-label="Reset Practice, Shortcut: (Escape)"
              onClick={handleReset}
              data-cy="reset-practice-race-button"
              size="sm"
              variant="outline"
            >
              Restart &#40;Esc&#41;
            </Button>
          </React.Fragment>
        )}
      </div>
    );
  }
);

RacePracticeCardFooter.displayName = "RacePracticeCardFooter";
export default RacePracticeCardFooter;
