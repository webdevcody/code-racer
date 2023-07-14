"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiContext } from "@/context/confetti";
import Link from "next/link";
import React, { useState } from "react";
import { addSnippetAction } from "../actions";
import LanguageDropDown from "./language-dropdown";

const MIN_SNIPPET_LENGTH = 30;

export default function AddSnippetForm({}) {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");

  const { toast } = useToast();
  const confettiCtx = useConfettiContext();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // form validation for empty fields
    if (!codeLanguage || !codeSnippet) {
      toast({
        title: "Error!",
        description: "Please fill all the fields",
        duration: 5000,
        style: {
          background: "hsl(var(--destructive))",
        },
      });
      return;
    }

    // form validation for codeSnippet Length
    if (codeSnippet.replace(/[\n\t\s]/g, "").length < MIN_SNIPPET_LENGTH) {
      toast({
        title: "Error!",
        description:
          "Minimum number of character is not met. Please enter more than 30 characters",
        duration: 5000,
        style: {
          background: "hsl(var(--destructive))",
        },
      });
      return;
    }

    // error handling if prisma upload fails
    await addSnippetAction({
      language: codeLanguage,
      code: codeSnippet,
    })
      .then((res) => {
        if (res?.message === "snippet-created-and-achievement-unlocked") {
          toast({
            title: "Achievement Unlocked",
            description: "Uploaded First Snippet",
          });
          confettiCtx.showConfetti();
        }
        toast({
          title: "Success!",
          description: "Snippet added successfully",
          duration: 5000,
          variant: "middle",
          action: (
            <Link href="/race" className={buttonVariants({ variant: "outline" })}>
              Click to Race
            </Link>
          ),
        });
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: "Something went wrong!" + err.message,
          duration: 5000,
          style: {
            background: "hsl(var(--destructive))",
          },
        });
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
        <LanguageDropDown
          codeLanguage={codeLanguage}
          setCodeLanguage={setCodeLanguage}
        />

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
