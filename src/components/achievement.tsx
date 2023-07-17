import { Achievement } from "@/types/achievement";
import Image from "next/image";
import { Icons } from "./icons";

const Achievement = ({
  achievement,
}: {
  achievement: Pick<Achievement, "image" | "name" | "description"> & {
    unlockedAt: Date;
  };
}) => {
  return (
    <div className="md:pr-5 w-full pb-5 md:w-1/2">
      <div className="flex flex-wrap gap-5 px-8 py-4 bg-accent">
        <div className="w-14">
          <Image
            className="object-contain w-full h-full"
            src={achievement.image}
            width={100}
            height={100}
            alt={`Achievement: ${achievement.name}`}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{achievement.name}</h3>
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
          <p className="flex mt-1 items-center gap-2 text-xs text-accent-foreground">
            <Icons.trophy size="1rem" />
            <span>
              Unlocked on{" "}
              <time>{achievement.unlockedAt.toLocaleDateString()}</time>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
