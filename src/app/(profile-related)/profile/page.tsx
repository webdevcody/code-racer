import Image from "next/image";

import { getCurrentUser } from "@/lib/session";

import Achievement from "@/components/achievement";
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
  const achievements = await prisma.userAchievement.findMany({
    where: {
      userId: uid,
    },
    include: {
      achievement: true,
    },
  });
  const totalPoints = 0;

  return (
    <main className="py-8 grid place-items-center h-[clamp(40rem,82.5dvh,50rem)]">
      <div className="overflow-hidden relative w-[95%] max-w-[22.5rem] h-[32.5rem] rounded-2xl border-2 border-solid border-secondary-foreground">
        <article className="p-2 flex flex-col gap-2 items-center">
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
          <span className="mt-10">Total Points: {totalPoints}</span>
          {achievements.length ? (
            <ul className="w-fit max-w-[292px] flex items-center flex-wrap gap-1 p-2 border-border rounded-sm bg-primary-foreground">
              {achievements.map(({ achievement, unlockedAt }) => (
                <Achievement
                  key={achievement.id}
                  achievement={{
                    name: achievement.name,
                    description: achievement.description,
                    unlockedAt,
                    image: achievement.image,
                  }}
                />
              ))}
            </ul>
          ) : null}
        </article>
      </div>
    </main>
  );
}
