import Image from "next/image";
import {
  DisplayNameComponent,
  ProfileImageButton
} from "./_components";

export const metadata = {
  title: "Profile Page"
};

export default async function ProfilePage() {
  {/** Dynamic data fetching will be done soon. Placeholder image from <a href="https://www.freepik.com/free-vector/businessman-character-avatar-isolated_6769264.htm#query=profile%20placeholder&position=1&from_view=keyword&track=ais">Image by studiogstock</a> on Freepik */ }
  const user: any = null;
  const photoURL = user?.photoURL ?? "/placeholder-image.jpg";
  const totalPoints = user?.gameData.totalPoints ?? 0;
  return (
    <section className="flex flex-col gap-8">
      <article className="flex flex-col sm:flex-row gap-4">
        <div className="overflow-hidden rounded-full w-40 h-40">
          <ProfileImageButton
            photoURL={photoURL}
          >
            <Image
              src={photoURL}
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
            <DisplayNameComponent displayName={user?.displayName} />
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