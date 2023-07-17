import Image from "next/image";

import { getCurrentUser } from "@/lib/session";

import AchievementCard from "@/components/achievement";
import { achievements } from "@/config/achievements";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ChangeNameForm from "./_components/change-name-form";
import ProfileNav from "./_components/profile-nav";
import { Bio } from "./_components/bio";
import { notFound } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import LogoutBtn from "./_components/logout-button";

export const metadata = {
  title: "Profile Page",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  // stuff that can be undefined or null
  const photoURL = user.image ?? "/placeholder-image.jpg";
  const displayName = user.name ?? "Display Name";

  const userAchievements = await prisma.achievement.findMany({
    where: {
      userId: user.id,
    },
  });

  // get bio, can be null
  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!userData) notFound();

  const totalPoints = 0;

  return (
    <main>
      <article className="lg:h-[calc(100vh-9rem)] grid lg:grid-cols-3 2xl:grid-cols-4 lg:gap-8">
        <section className="flex flex-col items-center border place-self-center w-fit p-4 rounded-md justify-between col-span-1 h-full">
          <div className="flex flex-col items-center gap-5">
            <Link
              href={`/view-photo?photoURL=${photoURL}`}
              title="View Profile Picture"
              prefetch
              className="flex justify-center items-center rounded-full w-40 mx-auto"
            >
              <Image
                src={photoURL}
                alt="Profile Picture"
                width={200}
                height={200}
                loading="eager"
                fetchPriority="high"
                priority
                className="object-cover h-40 w-40 md:w-full md:h-full rounded-full"
              />
            </Link>
            <ChangeNameForm displayName={displayName} />
            <Bio bio={userData.bio} />
            <span className="whitespace-nowrap">
              Total Points: {totalPoints}
            </span>
          </div>
          <div className="flex items-center justify-center gap-5 mt-5">
            <ProfileNav displayName={displayName} />
            <LogoutBtn />
          </div>
        </section>
        <section className="lg:col-span-2 2xl:col-span-3 mb-6">
          <div className="py-5">
            <Heading title="Achievements" centered />
          </div>
          {userAchievements.length ? (
            <>
              <ul className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                {userAchievements.map(({ achievementType, unlockedAt }) => {
                  const achievement = achievements.find(
                    (achievement) => achievement.type === achievementType,
                  );
                  if (!achievement) return null;
                  return (
                    <AchievementCard
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
            </>
          ) : (
            <p className="flex items-center justify-center">
              You don&apos;t have achievements, yet!
            </p>
          )}
        </section>
      </article>
    </main>
  );
}
