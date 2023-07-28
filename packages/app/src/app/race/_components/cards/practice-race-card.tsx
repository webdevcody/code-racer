"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageDropDown from "@/app/add-snippet/_components/language-dropdown";
import { bruno_ace_sc } from "@/lib/fonts";

export default function PracticeRaceCard() {
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
    <Card
      className="flex flex-col justify-between flex-1 border-2 border-warning"
      data-cy="practice-card"
    >
      <CardHeader>
        <div className="grid text-center place-content-center">
          <Target className="justify-self-center" size={40} />
          <h2
            style={bruno_ace_sc.style}
            className="text-3xl font-bold text-warning"
          >
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
          className="grid items-start grid-cols-2 gap-2"
        >
          <div className="flex flex-col">
            <LanguageDropDown
              className={cn(
                "w-full",
                buttonVariants({ variant: "ghost" }),
                error && "border-red-500",
              )}
              codeLanguage={selectedPracticeLanguage}
              setCodeLanguage={handleSetCodeLanguage}
            />
            <span className="text-red-500">{error}</span>
          </div>
          <Button
            disabled={selectedPracticeLanguage === ""}
            variant="black"
            className="relative justify-start border"
            data-cy="practice-button"
          >
            Practice{" "}
            <ArrowRight
              size="20"
              className="absolute -translate-y-1/2 right-4 top-1/2"
            />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
