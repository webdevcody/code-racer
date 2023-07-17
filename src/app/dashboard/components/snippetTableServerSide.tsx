import React from "react";
import { prisma } from "@/lib/prisma";
import { SnippetsHist } from "./snippetHist";
import { User } from "next-auth";

export default async function SnippetTableServerSide({ user }: { user: User }) {
  const recentSnippets = await prisma.snippet.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="pt-10">
      <SnippetsHist data={recentSnippets} />
    </div>
  );
}
