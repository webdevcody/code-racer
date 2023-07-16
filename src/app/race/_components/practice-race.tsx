"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageDropDown from "@/app/add-snippet/_components/language-dropdown";

export default function PracticeRace() {
  const [languageSinglePlayer, setLanguageSinglePlayer] = useState("");
  const [error, setError] = useState("");


  const router = useRouter();

  function handleSetCodeLanguage(props: SetStateAction<string>) {
    setLanguageSinglePlayer(props);
    setError("");
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Practice</h2>
            <p>Practice typing with a random snippet from your snippets</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            if (!languageSinglePlayer) {
              setError("please select a language to practice");
              return;
            }
            router.push(
              `/race/practice${languageSinglePlayer ? "?lang=" : ""
              }${encodeURIComponent(languageSinglePlayer)}`, // Make sure it is URL encoded
            );
          }}
          className="flex items-start gap-2"
        >
          <Button>Practice</Button>
          <div className="flex flex-col">
            <LanguageDropDown
              className={cn("w-fit", error && "border-red-500")}
              codeLanguage={languageSinglePlayer}
              setCodeLanguage={handleSetCodeLanguage}
            />
            <span className="text-red-500">{error}</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
