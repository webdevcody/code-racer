"use client";

import type { NextPage } from "next";

import React from "react";
import dynamic from "next/dynamic";
import { z } from "zod";

import { timeStampSchema } from "@/app/race/_utils/race-dispatch";
import { SESSION_STORAGE_KEY_TIMESTAMP } from "@/app/race/_components/practice/race-practice-card";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import LikeDislikeSnippet from "./_components/like-dislike-snippet";
import { useSession } from "next-auth/react";

const Result = dynamic(() => import("./_components/result"), {
  ssr: false,
});

const ReplayCard = dynamic(() => import("./_components/replay-card"), {
  ssr: false,
});

export type chartTimeStamp = z.infer<typeof timeStampSchema>;

/** Why session storage?
 *  1. Data gets deleted when a user goes to a new tab or removes the current tab
 *  2. We will save once the user finished the race, we don't want them to visit the results
 *  page everytime. We can make a different page for that (viewing of snippet results. Maybe a table?)
 *  3. Good for both anonymous and logged in users. (Wherein, we will save the data on the race page if the user
 *  is logged in.)
 *
 *  Why did we remove Top Ten?
 *  1. We cannot call findMany since we need the component to be a
 *  server component.
 *  2. It's much more clear how this overall page operates if we separate it.
 *  The main purpose of this page is to show the results of a user from their game.
 *  We can use the leaderboard so they can choose options of what they can see
 *  (like, top ten or something.).
 */
const MainContent: NextPage = () => {
  const [timeStamp, setTimeStamp] = React.useState<chartTimeStamp>();
  const [currentTab, setCurrentTab] = React.useState<"results" | "replay">(
    "results"
  );
  const [snippetID, setSnippetID] = React.useState("");

  const router = useRouter();
  const { data } = useSession();

  React.useEffect(() => {
    if (!sessionStorage) {
      return;
    }
    const resultObject = sessionStorage.getItem(SESSION_STORAGE_KEY_TIMESTAMP);
    if (!resultObject) {
      router.replace("/race");
      return;
    }
    const parsedResultObject = JSON.parse(resultObject) as {
      snippetID: string;
      chart: chartTimeStamp;
    };
    console.log(
      "A bug on tracking cpm or accuracy occured!",
      timeStampSchema.safeParse(parsedResultObject.chart).success
    );
    setTimeStamp(parsedResultObject.chart);
    setSnippetID(parsedResultObject.snippetID);
  }, [router]);

  return (
    <React.Fragment>
      <header className="flex flex-col gap-8 w-[95%] mx-auto pb-8">
        <div className="flex flex-wrap gap-4">
          <Button
            size="sm"
            onClick={() =>
              router.replace(
                "/race/practice?snippetId=" + encodeURIComponent(snippetID)
              )
            }
          >
            Practice With This Snippet Again
          </Button>
          {data && <div>
            <LikeDislikeSnippet snippetId={snippetID} />
          </div>}
        </div>
        <nav className="w-fit">
          <ul className="dark:bg-secondary/20 rounded-lg p-1 flex items-center gap-1">
            <li>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentTab("results")}
              >
                Results
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentTab("replay")}
              >
                Replay
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      {currentTab === "results" && (
        <React.Fragment>
          {timeStamp && (
            <section className="w-[95%] mx-auto flex flex-col gap-12">
              <Result timeStamp={timeStamp} />
            </section>
          )}
        </React.Fragment>
      )}
      {currentTab === "replay" && timeStamp && (
        <section className="w-[95%] mx-auto flex flex-col gap-12">
          <ReplayCard timeStamp={timeStamp} />
        </section>
      )}
    </React.Fragment>
  );
};

export default MainContent;
