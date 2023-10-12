import React from "react";

import { ProgressBar, ProgressIndicator } from "@/components/ui/progress-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  name: string;
  image: string;
  progress: number;
};

const ProgressTracker: React.FC<Props> = React.memo(
  ({ name, image, progress }) => {
    return (
      <div className="relative flex items-center mb-5">
        <ProgressBar>
          <ProgressIndicator
            progress={progress}
            className="ease-in duration-200"
          >
            <Avatar
              style={{ left: Math.ceil(progress * 0.98) + "%" }}
              className="w-7 h-7 absolute left-0 top-[-50%] border-2 border-monochrome rounded-full transition-[left] duration-200 ease-in"
            >
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              <AvatarImage
                src={image}
                alt={`${name}'s avatar`}
                height={28}
                width={28}
              />
            </Avatar>
          </ProgressIndicator>
        </ProgressBar>
      </div>
    );
  }
);

ProgressTracker.displayName = "ProgressTracker";

export default ProgressTracker;
