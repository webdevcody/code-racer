import Image from "next/image";

import { getCurrentUser } from "@/lib/session";

import Achievement from "@/components/achievement";
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
      <article className="md:h-[calc(100vh-56px)]">
        <section className="md:flex h-full w-full gap-5">
          <div className="md:w-1/3 w-full md:border-r md:border-b-0 border-b py-5">
            <div>
              <Link
                href={`/view-photo?photoURL=${photoURL}`}
                title="View Profile Picture"
                prefetch
                className="rounded-full w-40 mx-auto block"
              >
                <Image
                  src={photoURL}
                  alt="Profile Picture"
                  width={200}
                  height={200}
                  loading="eager"
                  fetchPriority="high"
                  priority
                  className="object-cover w-full h-full rounded-full"
                />
              </Link>
            </div>
            <div className="mt-5">
              <ChangeNameForm displayName={displayName} />
            </div>
            <div className="flex items-center justify-center gap-5">
              <Bio bio={userData.bio} />
              <span>Total Points: {totalPoints}</span>
            </div>
            <div className="flex items-center justify-center gap-5 mt-10">
              <ProfileNav displayName={displayName} />
              <LogoutBtn />
            </div>
          </div>
          <div className="flex-1 md:h-full md:overflow-y-auto">
            {userAchievements.length ? (
              <>
                <div className="py-5">
                  <Heading title="Achievements" centered />
                </div>
                <ul className="flex flex-wrap p-5">
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
              </>
            ) : (
              <p className="p-5">You Don&apos;t Have Achievements</p>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
