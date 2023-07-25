import React from "react";
import { SnippetsHist } from "./snippetHist";
import { getSnippets } from "./loaders";

export default async function SnippetTableServerSide() {
  const recentSnippets = await getSnippets();

  return (
    <div className="pt-10">
      <SnippetsHist data={recentSnippets} />
    </div>
  );
}
