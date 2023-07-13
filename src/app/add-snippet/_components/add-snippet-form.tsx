"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { addSnippetAction } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import LanguageDropDown from "./language-dropdown";

export default function AddSnippetForm({}) {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addSnippetAction({
      language: codeLanguage,
      code: codeSnippet,
    });
    console.log("language: ", codeLanguage);
    console.log("snippet: ", codeSnippet);

    resetFields();
  }
  function resetFields() {
    setCodeSnippet("");
    setCodeLanguage("");
  }
  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="flex flex-col gap-3 mt-5"
    >
      <div className="w-full">
        
        <LanguageDropDown codeLanguage={codeLanguage} setCodeLanguage={setCodeLanguage} />

        {/* <select
          onChange={(e) => setCodeLanguage(e.target.value)}
          className="w-full px-4 py-3"
          name=""
          id=""
        >
          <option value="select">Select Snippet Language</option>
          {snippetLangs.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.name}
            </option>
          ))}
        </select> */}
      </div>
      <div>
        <Textarea
          onChange={(e) => setCodeSnippet(e.target.value)}
          name=""
          value={codeSnippet}
          id=""
          rows={8}
          className="w-full p-2 border"
          placeholder="Type your custom code here..."
        />
      </div>
      <Button className="w-fit">Upload</Button>
    </form>
  );
}
