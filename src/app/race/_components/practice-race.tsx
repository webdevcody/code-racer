"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageDropDown from "@/app/add-snippet/_components/language-dropdown";
import { bruno_ace_sc } from "@/lib/fonts";

export default function PracticeRace() {
  const [selectedPracticeLanguage, setSelectedPracticeLanguage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSetCodeLanguage(props: SetStateAction<string>) {
    setSelectedPracticeLanguage(props);
    setError("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!selectedPracticeLanguage)
      return setError("please select a language to practice");
    router.push(
      `/race/practice?lang=${encodeURIComponent(selectedPracticeLanguage)}`, // Make sure it is URL encoded
    );
  }

  return (
    <Card className="flex-1 bg-warning text-black">
      <CardHeader>
        <div className="grid place-content-center text-center">
          <Target className="justify-self-center" size={40} />
          <h2 style={bruno_ace_sc.style} className="text-3xl font-bold">
            Practice
          </h2>
          <p className="font-light">
            Practice typing with a random snippet from your snippets
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 items-start gap-2"
        >
          <div className="flex flex-col">
            <LanguageDropDown
              className={cn("w-full", error && "border-red-500")}
              codeLanguage={selectedPracticeLanguage}
              setCodeLanguage={handleSetCodeLanguage}
            />
            <span className="text-red-500">{error}</span>
          </div>
          <Button
            disabled={selectedPracticeLanguage === ""}
            variant="black"
            className="relative justify-start"
          >
            Practice{" "}
            <ArrowRight
              size="20"
              className="absolute right-4 opacity-50 top-1/2 -translate-y-1/2"
            />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
