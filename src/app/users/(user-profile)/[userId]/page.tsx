import Image from "next/image";
import Link from "next/link";

import { AchievementCard } from "@/components/achievement";
import ProfileCard from "../(components)/profile-card";

import { achievements } from "@/config/achievements";
import { Heading } from "@/components/ui/heading";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import NotCurrentUserButtons from "../(components)/not-current-user-buttons";
import { findUser, findUserAchievements } from "./actions";
import UserCommits from "../(components)/UserCommits";

export const metadata = {
  title: "Profile Page",
};

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const userParamsAchievements = await findUserAchievements({
    userId: params.userId,
  });

  const userParamsData = await findUser({
    userId: params.userId,
  });

  if (!userParamsData) return notFound();

  /** Get the current user to check if they're viewing their own profile */
  const user = await getCurrentUser();

  const photoURL = userParamsData?.image ?? "/placeholder-image.jpg";
  const displayName = userParamsData?.name ?? "Display Name";
  const bio = userParamsData?.bio;
  const following = /** userParamsData.following */ [] as string[];
  const followers = /** userParamsData.followers */ [] as string[];
  const profileEmail = userParamsData?.email ?? "";

  const totalPoints = 0;

  return (
    <main>
      <article className="flex flex-col md:flex-row items-center md:items-start md:justify-start gap-8 py-8">
        {user?.id === params.userId ? (
          /** Editable profile card with edit profile and settings buttons. */
          <ProfileCard
            photoURL={photoURL}
            displayName={displayName}
            bio={bio}
            totalPoints={totalPoints}
            followers={followers}
            following={following}
          />
        ) : (
          <section className="w-full md:w-[40%] lg:w-[30%] xl:w-[25%]">
            <div data-name="profile-card">
              <Link
                href={`/users/view-photo?photoURL=${photoURL}`}
                title="View Profile Picture"
                prefetch
                className="inline-block overflow-hidden rounded-full w-32 aspect-square md:w-[90%] mx-auto"
              >
                <Image
                  src={photoURL}
                  alt="Profile Picture"
                  width={200}
                  height={200}
                  loading="eager"
                  fetchPriority="high"
                  priority
                  className="object-cover w-full h-full"
                />
              </Link>
              <h2 className="text-monochrome/60 text-2xl mt-2 break-words w-full max-w-sm md:max-w-none">
                {displayName}
              </h2>
              {bio && <p className="md:max-w-xs break-words mt-4">{bio}</p>}
              {user ? (
                <div className="flex pt-4 gap-6 justify-start items-center">
                  <NotCurrentUserButtons
                    userInViewId={userParamsData.id}
                    currentUserId={user?.id as string}
                    followers={followers}
                  />
                </div>
              ) : null}
              <section className="flex flex-wrap items-center gap-2 mt-4 text-xs text-monochrome/50">
                <div>Followers: {followers.length}</div>
                <div>Following: {following.length}</div>
              </section>
            </div>
            <hr className="bg-primary py-[0.1rem] rounded-full my-4" />
            <div>Total Points: {totalPoints}</div>
          </section>
        )}
        <section className="min-h-[20rem] w-full md:w-[60%] lg:w-[70%] xl:w-[75%]">
          <div>
            <Heading title="Achievements" centered />
          </div>
          <div className="flex flex-col items-center justify-start w-full pt-[clamp(0.5rem,calc(0.1rem+4vw),3rem)]">
            {userParamsAchievements?.length ? (
              <>
                <ul className="w-full gap-2 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 sm:gap-4">
                  {userParamsAchievements?.map(
                    ({ achievementType, unlockedAt }) => {
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
                    },
                  )}
                </ul>
              </>
            ) : (
              <>
                <p className="p-5 text-2xl font-bold max-w-2xl text-center">
                  {user?.id === params.userId ? (
                    <>
                      You currently have no achievements. You must&nbsp;
                      <Link href="/race" className="underline text-primary">
                        race
                      </Link>{" "}
                      to show off your greatness.{" "}
                    </>
                  ) : (
                    <>
                      {displayName} currently has no achievements.&nbsp;
                      {user ? (
                        <>
                          <Link href="/race" className="underline text-primary">
                            Race
                          </Link>
                        </>
                      ) : (
                        <>Sign in</>
                      )}{" "}
                      to earn more achievements than them.
                    </>
                  )}
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
      <UserCommits profileEmail={profileEmail} />
    </main>
  );
}
