"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { addSnippetAction } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import LanguageDropDown from "./language-dropdown";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";

export default function AddSnippetForm({}) {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");
  const { toast } = useToast();

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
        action: (
          <ToastAction altText="error">
            <CrossCircledIcon width={32} height={32} />
          </ToastAction>
        ),
      });
      return;
    }

    // error handling if prisma upload fails
    try {
      await addSnippetAction({
        language: codeLanguage,
        code: codeSnippet,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error!",
        description: "Something went wrong! Please try again later.",
        duration: 5000,
        style: {
          background: "hsl(var(--destructive))",
        },
        action: (
          <ToastAction altText="error">
            <CrossCircledIcon width={32} height={32} />
          </ToastAction>
        ),
      });
    }
    // console.log("language: ", codeLanguage);
    // console.log("snippet: ", codeSnippet);

    toast({
      title: "Success!",
      description: "Snippet added successfully",
      duration: 3000,
      style: {
        background: "#A2FF86",
        color: "#213363",
      },
      action: (
        <ToastAction altText="error">
          <CheckIcon width={32} height={32} />
        </ToastAction>
      ),
    });

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
