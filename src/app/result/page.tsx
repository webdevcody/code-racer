import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "./chart";
import NavigationButtons from "./navigation-buttons";
import { Voting } from "./voting";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface ResultsPageProps {
  searchParams: {
    snippetId: string;
  };
}

const card = [
  { title: "WPM", value: "81 %" },
  { title: "Accuracy", value: "90 %" },
  { title: "Rank", value: "20" },
  { title: "Miss", value: "21" },
  { title: "Times", value: "30s" },
];

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const user = await getCurrentUser();

  if (!user) notFound();

  const usersVote = await prisma.snippetVote.findUnique({
    where: {
      userId_snippetId: {
        userId: user.id,
        snippetId: searchParams.snippetId,
      },
    },
  });

  const { snippetId } = searchParams;

  const snippet = await prisma.snippet.findUnique({
    where: {
      id: snippetId,
    },
  });

  return (
    <div className="w-auto">
      <div className="flex flex-col justify-center gap-4 mt-5">
        <div className="flex flex-row mx-28 gap-6">
          {card.map((c, idx) => {
            return (
              <Card className="w-[30%]" key={idx}>
                <CardHeader>
                  <CardTitle className="">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>{c.value}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="p-8 flex flex-col  rounded-xl bg-dark-lake">
        <div></div>
        <div className="flex flex-wrap justify-center gap-4">
          <Chart />
        </div>
      </div>
      <Voting
        userId={user.id}
        snippetId={snippetId}
        usersVote={usersVote ?? undefined}
      />
      <NavigationButtons onReview={snippet?.onReview} />
      <div className="text-center mt-5 text-gray-600">
        <span className="bg-[#0b1225]  m-1 p-1 rounded-md"> tab </span> +{" "}
        <span className="bg-[#0b1225] m-1 p-1 rounded-md"> enter </span> -
        restart game
      </div>
    </div>
  );
}
