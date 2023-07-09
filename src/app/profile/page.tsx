import Image from "next/image";
import {
  ProfileImageButton,
  ToggleChangeName
} from "./_components";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Profile Page"
};

export default async function ProfilePage() {
  const session = await getSession();
  const displayName = session?.user?.name;
  const photoURL = session?.user?.image;

  {/** Static data unrelated to auth for now */ }
  const totalPoints = 0;
  return (
    <section className="flex flex-col gap-8">
      <article className="flex flex-col sm:flex-row gap-4">
        <div className="overflow-hidden rounded-full w-40 h-40">
          <ProfileImageButton
            photoURL={photoURL}
          >
            <Image
              src={photoURL ?? "/placeholder.png"}
              alt="Profile picture"
              width={127}
              height={127}
              className="w-full h-full object-cover"
              fetchPriority="high"
              loading="eager"
              priority
            />
          </ProfileImageButton>
        </div>
        <div className="mt-2">
          <div className="flex items-start gap-4 mb-2">
            <h1 className="font-bold text-2xl 2xl:text-3xl">{displayName}</h1>
            <ToggleChangeName />
          </div>
          <div>Total Points: {totalPoints}</div>
        </div>
      </article>
      <article className="">
        <h3 className="text-xl font-medium mb-2">Statistics</h3>
        <section>
          <article>
            <h3>Matches Played & Average Time Spent</h3>
          </article>
          <article>
            <h3>Average Speed</h3>
          </article>
          <article>
            <h3>Average Points Per Match</h3>
          </article>
        </section>
      </article>
    </section>
  );
};