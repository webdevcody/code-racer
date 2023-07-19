import Image from "next/image";
import Link from "next/link";

import AchievementCard from "@/components/achievement";
import ProfileNav from "./_components/profile-nav";

import { achievements } from "@/config/achievements";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { findUserAchievements } from "@/app/_actions/achievements";
import { findUser } from "@/app/_actions/user";
import ProfileCard from "./_components/profile-card";

export const metadata = {
  title: "Profile Page",
};

export default async function ProfilePage() {
  const userAchievements = (await findUserAchievements({})).data;
  const userData = (await findUser({})).data;

  const photoURL = userData?.image ?? "/placeholder-image.jpg";
  const displayName = userData?.name ?? "Display Name";
  const bio = userData?.bio;

  const totalPoints = 0;

  return (
    <main>
      <article className="flex flex-col md:flex-row justify-center items-center gap-8 py-8">
        <ProfileCard
          photoURL={photoURL}
          displayName={displayName}
          bio={bio}
          totalPoints={totalPoints}
        />
        <section className="min-h-[30rem] md:w-[60%] lg:w-[70%] xl:w-[75%]">
          <div>
            <Heading title="Achievements" centered />
          </div>
          <div className="flex flex-col items-center justify-start w-full pt-[clamp(0.5rem,calc(0.1rem+4vw),3rem)]">
            {userAchievements?.length ? (
              <>
                <ul className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {userAchievements?.map(({ achievementType, unlockedAt }) => {
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
              <>
                <p className="p-5 text-2xl font-bold max-w-2xl text-center">
                  You currently have no achievements. You must
                  <Link href="/race" className="underline text-primary">
                    &nbsp;race
                  </Link>{" "}
                  to show off your greatness.{" "}
                </p>
                <div className="w-[clamp(20rem,calc(0.1rem+8vw),80rem)] aspect-square">
                  <Image
                    src="/images/achievement_page.svg"
                    width={400}
                    height={400}
                    alt="image"
                    className="w-full h-full object-contain"
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
