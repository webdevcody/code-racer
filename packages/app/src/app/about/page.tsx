import { Heading } from "@/components/ui/heading";
import Link from "next/link";

const page = () => {
  return (
    <div className="pt-12 pb-12">
      <Heading title="About" />
      <p className="text-left mt-4 text-sm lg:text-md">
        Welcome to Code Racer, an exciting open-source game that aims to provide
        a fun and challenging platform for developers of all skill levels to
        improve their coding abilities and compete with fellow developers in
        real-time coding races.
      </p>
      <p className="text-left mt-2 text-sm lg:text-md">
        Whether you&apos;re a beginner looking to enhance your coding skills or
        an experienced developer seeking a new challenge, Code Racer is for you.
      </p>
      <section className="text-left mt-6 text-sm lg:text-md">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <p className="mb-4">
          Playing Code Racer is simple. Here&apos;s how you can get started
        </p>

        <h3 className="mt-2 font-bold">Join a Race:</h3>
        <p className="mb-2">
          Choose a race that suits your skill level or create a new one. You can
          invite friends or compete against random players from the community.
        </p>

        <h3 className="mt-2  font-bold">Get Ready:</h3>
        <p className="mb-2">
          Once the race starts, you will be presented with code snippets in your
          chosen programming language.
        </p>

        <h3 className="mt-2 font-bold">Type Like the Wind:</h3>
        <p className="mb-2">
          Your mission is to type out the presented code snippet as quickly and
          accurately as you can. Watch out for tricky syntax and special
          characters!
        </p>

        <h3 className="mt-2 font-bold">Climb the Leaderboard:</h3>
        <p className="mb-2">
          Each completed code snippet adds to your score. Compete against other
          racers to climb the leaderboard and prove your typing supremacy.
        </p>
      </section>
      <section className="text-left mt-6 text-sm lg:text-md">
        <h2 className="text-xl font-semibold">Get Involved</h2>
        <p>
          As an open-source project, Code Racer thrives on the support of its
          community. If you&apos;re enthusiastic about enhancing the game or
          adding new features, we invite you to contribute to the project. Check
          out our GitHub repository{" "}
          <Link
            className="font-bold"
            href="https://github.com/webdevcody/code-racer"
            target="_blank"
          >
            here
          </Link>{" "}
          to get started.
        </p>
      </section>
    </div>
  );
};

export default page;
