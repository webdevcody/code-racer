import React from "react";

import { cn } from "@/lib/utils";

type Props = {
  amountOfRows: number;
  currentRowInRecursion?: number;
  currentLineNumber: number;
};

const RowLineTracker: React.FC<Props> = React.memo(
  ({ amountOfRows, currentRowInRecursion = 0, currentLineNumber }) => {
    return (
      <React.Fragment>
        <span
          className={cn("px-1", {
            "bg-slate-500/80 dark:bg-slate-800/80":
              currentLineNumber === currentRowInRecursion,
          })}
        >
          {currentRowInRecursion + 1}
        </span>
        {currentRowInRecursion !== amountOfRows && (
          <RowLineTracker
            amountOfRows={amountOfRows}
            currentRowInRecursion={currentRowInRecursion + 1}
            currentLineNumber={currentLineNumber}
          />
        )}
      </React.Fragment>
    );
  }
);

RowLineTracker.displayName = "RowLineTracker";
export default RowLineTracker;
