import type { Snippet } from ".prisma/client";

import React from "react";
import Link from "next/link";

import { getRandomSnippet } from "../loaders";
import { getSnippetById } from "../loaders";

import { getCurrentUser } from "@/lib/session";

import { Heading } from "@/components/ui/heading";
import { languageTypes } from "@/lib/validations/room";
import dynamic from "next/dynamic";

const RacePracticeCard = dynamic(
  () => import("../../_components/practice/race-practice-card")
);

type PracticeRacePageProps = {
  searchParams: {
    snippetId: string;
    lang: string;
  };
};

export default async function PracticeRacePage({
  searchParams,
}: PracticeRacePageProps) {
  const session = await getCurrentUser();

  let snippet: Snippet | null = null;

  if (searchParams.snippetId && typeof searchParams.snippetId === "string") {
    snippet = await getSnippetById(searchParams.snippetId);
  } else if (searchParams.lang) {
    const language = languageTypes.parse(searchParams.lang);
    snippet = await getRandomSnippet({
      language: language,
    });
  }

  return (
    <React.Fragment>
      <header className="pt-12">
        <Heading
          size="h1"
          title="Practice Your Typing Speed"
          description="Start typing and see your code go BLAZINGLY FAST."
        />
      </header>
      <main className="py-12">
        {snippet && (
          <RacePracticeCard
            session={{
              id: session?.id,
              name: session?.name,
              image: session?.image,
            }}
            snippet={snippet}
          />
        )}

        {!snippet && (
          <div className="dark:text-white text-black bg-slate-200/60 dark:bg-black/60 rounded-lg mx-auto dark:border-2 shadow-md shadow-black/20 p-8 ">
            <div className="max-w-md">
              <Heading
                typeOfHeading="h2"
                size="h2"
                title="Uh Oh... There's no code to display :("
                description="No snippet exists for this specific snippetID or language. Maybe try creating one?"
              />
            </div>
            <div className="mt-4">
              <Link
                className="py-2 px-4 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                href={
                  "/add-snippet?" +
                  (searchParams.lang
                    ? `lang=${encodeURIComponent(searchParams.lang)}`
                    : `snippetId=${encodeURIComponent(searchParams.snippetId)}`)
                }
              >
                Create one now
              </Link>
            </div>
          </div>
        )}

        {snippet && (
          <div className="pt-12">
            <Heading
              typeOfHeading="h2"
              size="h2"
              title="Rules & Mechanics"
              description="How this game works and its caveats."
            />
            <ol className="list-decimal mt-4 pl-4 flex flex-col gap-4">
              <li>
                The timer will start once you start typing on the displayed code
                you see above.
              </li>
              <li>
                Once you mistype a character, you must fix it before you can
                continue typing.
              </li>
              <li>
                You can start typing by clicking on the displayed code above.
              </li>
              <li>
                The race will finish automatically once you complete the code
                snippet above.
              </li>
              <li>
                If you are logged in, your data will be saved on the server for
                future references, such as:
                <ol className="list-disc pl-8 mt-1 flex flex-col gap-2">
                  <li>Your Average CPM</li>
                  <li>Your Most Used Code Languages</li>
                </ol>
              </li>
              <li>
                When you press Enter without the ⏎ symbol and you are not on a
                whitespace, nothing will happen.
              </li>
              <li>
                When you press Enter on a ⏎ symbol &#40;Going to a new
                line&#41;, you will be able to go to the next line and the
                whitespaces will automatically be typed in for you.
              </li>
              <li>You can restart since this is practice mode.</li>
              <li>
                If you click on get a new snippet and it&apos;s still the same,
                then there is not enough snippet for that language. Please try
                creating a new one or keep hitting the get new snippet button.
              </li>
            </ol>
          </div>
        )}
      </main>
    </React.Fragment>
  );
}
