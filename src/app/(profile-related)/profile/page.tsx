import Image from "next/image";

import { getCurrentUser } from "@/lib/session";

import { ChangeNameForm, ProfileNav } from "./_components";
import Link from "next/link";

export const metadata = {
  title: "Profile Page",
};

export default async function ProfilePage() {

  const user = await getCurrentUser();
  const photoURL = user?.image;
  const displayName = user?.name;
  const uid = user?.id;
  {
    /** Static data unrelated to auth for now */
  }
  const totalPoints = 0;
  return (
    <main className="py-8 grid place-items-center h-[clamp(40rem,82.5dvh,50rem)]">
      <div className="overflow-hidden relative w-[95%] max-w-[22.5rem] h-[32.5rem] rounded-2xl border-2 border-solid border-secondary-foreground">
        <article className="p-2 flex flex-col gap-2 items-center">
          <ProfileNav
            displayName={displayName as string}
            uid={uid as string}
          />
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
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <ChangeNameForm displayName={displayName} />
          <span>Total Points: {totalPoints}</span>
        </article>
      </div>
    </main>
  );
}
