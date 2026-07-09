import { Heading } from "@/components/ui/heading";
import Link from "next/link";

const page = () => {
  return (
    <div className="pt-12 pb-12">
       <section className="flex flex-col items-center gap-3">
        <Heading title="About" />
      <p className="text-center mt-4 text-lg lg:w-1/2">
        Welcome to Code Racer, an exciting open-source game that aims to provide
        a fun and challenging platform for developers of all skill levels to
        improve their coding abilities and compete with fellow developers in
        real-time coding races.
      </p>
      <p className="text-center mt-2 text-sm text-gray-500 lg:w-1/3">
        Whether you&apos;re a beginner looking to enhance your coding skills or
        an experienced developer seeking a new challenge, Code Racer is for you.
      </p>  
        </section>

      {/* Stylish Separator */}
      <div className="flex justify-center mt-10">
        <span className="text-5xl text-primary">↓</span>
      </div>

      <section className="text-center flex flex-col mt-6 text-sm gap-4">
        <h2 className="text-3xl font-semibold">How It Works</h2>

        <div className="flex flex-col gap-3 mt-3 items-center">
        <h3 className="font-bold text-lg">Join a Race:</h3>
        <p className="text-sm font-light lg:w-1/3">
          Choose a race that suits your skill level or create a new one. You can invite friends or compete against random players from the community.
        </p>
        </div>

        <div className="flex flex-col gap-3 items-center">
        <h3 className="mt-4 font-bold text-lg">Get Ready:</h3>
        <p className="mb-2 text-sm font-light lg:w-1/3">
        Once the race starts, you will be presented with code snippets in your chosen programming language.</p>
        </div>

        <div className="flex flex-col gap-3 items-center">
        <h3 className="mt-4 font-bold text-lg">Type Like the Wind:</h3>
        <p className="mb-2 text-sm font-light lg:w-1/3">
        Your mission is to type out the presented code snippet as quickly and
        accurately as you can. Watch out for tricky syntax and special
        characters!
        </p>
        </div>

        <div className="flex flex-col gap-3 items-center">
        <h3 className="mt-4 font-bold text-lg">Climb the Leaderboard:</h3>
        <p className="mb-2 text-sm font-light lg:w-1/3">
        Each completed code snippet adds to your score. Compete against other
        racers to climb the leaderboard and prove your typing supremacy.
        </p>
        </div>
      </section>

      <div className="flex justify-center mt-10">
        <span className="text-5xl text-primary">↓</span>
      </div>

      <section className="mt-6 text-sm text-center flex flex-col gap-5 items-center">
        <h2 className="text-5xl font-semibold tracking-tight">Get Involved</h2>
        <p className="text-sm lg:w-1/2">
          As an open-source project, Code Racer thrives on the support of its
          community. If you&apos;re enthusiastic about enhancing the game or
          adding new features, we invite you to contribute to the project. Check
          out our GitHub repository{" "}
          <Link
            className="font-bold text-blue-600 hover:underline"
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
