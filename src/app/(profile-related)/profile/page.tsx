import Image from "next/image";

import { getCurrentUser } from "@/lib/session";

import Achievement from "@/components/achievement";
import { AddBio } from "@/components/add-bio";
import { achievements } from "@/config/achievements";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ChangeNameForm from "./_components/change-name-form";
import ProfileNav from "./_components/profile-nav";

export const metadata = {
  title: "Profile Page",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const photoURL = user?.image as string;
  const displayName = user?.name as string;
  const uid = user?.id as string;
  const userAchievements = await prisma.achievement.findMany({
    where: {
      userId: uid,
    },
  });
  const totalPoints = 0;

  return (
    <main className="py-8 grid place-items-center h-[clamp(40rem,82.5dvh,50rem)]">
      <div className="relative w-[95%] max-w-[22.5rem] rounded-2xl border-2 border-solid border-secondary-foreground">
        <article className="flex flex-col items-center gap-2 p-2">
          <ProfileNav displayName={displayName} />
          <div className="pt-2 pb-1">
            <Link
              href={`/view-photo?photoURL=${photoURL}`}
              title="View Profile Picture"
              prefetch
              className="shadow-lg shadow-monochrome-with-bg-opacity bg-opacity-50 opacity-90 inline-block overflow-hidden w-36 h-36 rounded-full relative before:absolute before:content-[''] before:inset-0 before:w-full before:h-full before:z-10 hover:before:bg-monochrome-with-bg-opacity before:bg-opacity-10 hover:before:backdrop-blur-[1.5px] before:rounded-full"
            >
              <Image
                src={photoURL ?? "/placeholder-image.jpg"}
                alt="Profile Picture"
                width={200}
                height={200}
                loading="eager"
                fetchPriority="high"
                priority
                className="object-cover w-full h-full"
              />
            </Link>
          </div>
          <ChangeNameForm displayName={displayName} />
          <AddBio />
          <span className="mt-10">Total Points: {totalPoints}</span>

          <h2>Your Achievements</h2>
          {userAchievements.length ? (
            <ul className="gap-4 w-fit max-w-[292px] flex items-center flex-wrap p-2 rounded-sm">
              {userAchievements.map(({ achievementType, unlockedAt }) => {
                const achievement = achievements.find(
                  (achievement) => achievement.type === achievementType,
                );
                if (!achievement) return null;
                return (
                  <Achievement
                    key={achievement.type}
                    achievement={{
                      name: achievement.name,
                      description: achievement.description,
                      unlockedAt,
                      image: achievement.image,
                    }}
                  />
                );
              })}
            </ul>
          ) : null}
        </article>
      </div>
    </main>
  );
}
