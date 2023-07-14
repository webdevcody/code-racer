import {
  ProgressBar,
  ProgressIndicator,
} from "../../components/ui/progress-bar";
import Image from "next/image";
import type { User } from "next-auth";

interface RacePositionProps {
  inputLength: number;
  actualSnippetLength: number;
  user?: User;
}

const GOAL_COMPLETED = 100;

export default function RacePositionTracker({
  inputLength,
  actualSnippetLength,
  user,
}: RacePositionProps) {
  const progress = (inputLength / actualSnippetLength) * 100;

  return (
    <div className="relative mb-5 flex items-center">
      <ProgressBar>
        <ProgressIndicator progress={progress}>
          {progress !== GOAL_COMPLETED && (
            <Image
              className="absolute left-0 top-[-50%] border-2 border-monochrome rounded-full transition-all duration-700 ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
              src={user?.image ?? "/placeholder-image.jpg"}
              alt={`${user?.name} avatar` ?? "user avatar"}
              height={30}
              width={30}
              style={{ left: `${progress - 0.4}%` }}
            />
          )}
          {progress === GOAL_COMPLETED && (
            <Image
              className="absolute right-0 top-[-50%] border-2 border-monochrome rounded-full"
              src={user?.image ?? "/placeholder-image.jpg"}
              alt={`${user?.name} avatar` ?? "user avatar"}
              height={30}
              width={30}
            />
          )}
        </ProgressIndicator>
      </ProgressBar>
    </div>
  );
}
