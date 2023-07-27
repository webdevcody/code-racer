import { cn } from "@/lib/utils";
import { displayNumber } from "../_helpers/utils";

interface AdditionsDeletionsProps {
  additions: number;
  deletions: number;
  className?: string;
  verbose?: boolean;
}

export default function AdditionsDeletions({
  additions,
  deletions,
  className,
  verbose = false,
}: AdditionsDeletionsProps) {
  return (
    <div
      className={cn(
        "flex flex-row",
        "justify-between",
        "items-center",
        "p-0",
        "font-md",
        "text-muted-foreground",
        className,
      )}
    >
      <span className="text-green-500">
        +{displayNumber(additions)} {verbose && "additions"}
      </span>
      <span className="text-red-500">
        -{displayNumber(Math.abs(deletions))} {verbose && "deletions"}
      </span>
    </div>
    // <div className="flex-col font-md text-muted-foreground"><p className="text-green-500">+{additions} {verbose && "additions"}</p> <p className="text-red-500">-{Math.abs(deletions)} {verbose && "deletions"}</p></div>
  );
}
