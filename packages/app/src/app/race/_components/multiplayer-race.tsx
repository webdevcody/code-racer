"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { SetStateAction, useState } from "react";
import { bruno_ace_sc } from "@/lib/fonts";
import LanguageDropDown from "@/app/add-snippet/_components/language-dropdown";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function MultiplayerRace({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMultiplayerLanguage, setSelectedMultiplayerLanguage] =
    useState("");

  function handleSetCodeLanguage(props: SetStateAction<string>) {
    setSelectedMultiplayerLanguage(props);
    setError("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enabled) return;

    setIsLoading(true);
    setError("");
    if (!selectedMultiplayerLanguage)
      return setError("please select a language to practice");
    router.push(
      `/race/multiplayer?lang=${encodeURIComponent(
        selectedMultiplayerLanguage,
      )}`, // Make sure it is URL encoded
    );
    setIsLoading(false);
  }

  return (
    <Card className="flex flex-col justify-between flex-1 border-2 border-warning">
      <CardHeader>
        <div className="grid text-center place-content-center">
          <Users className="justify-self-center" size={40} />
          <h2
            style={bruno_ace_sc.style}
            className="text-3xl font-bold text-warning"
          >
            Multiplayer
          </h2>
          <p className="font-light">
            Race against other people and see who can type the fastest!
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className={clsx({
            "grid items-start grid-cols-2 gap-2": enabled,
            "grid items-center gap-2": !enabled,
          })}
        >
          {!enabled ? (
            <Button className="w-full" variant="black" disabled>
              Create Room (Coming Soon)
            </Button>
          ) : (
            <>
              <div className="flex flex-col">
                <LanguageDropDown
                  className={cn("w-full", error && "border-red-500")}
                  codeLanguage={selectedMultiplayerLanguage}
                  setCodeLanguage={handleSetCodeLanguage}
                />
                <span className="text-red-500">{error}</span>
              </div>
              <Button
                disabled={
                  !enabled || isLoading || selectedMultiplayerLanguage === ""
                }
                variant="black"
                className="relative justify-start border"
              >
                Start racing
                {isLoading ? (
                  <Loader2
                    size={20}
                    className="text-white absolute -translate-y-1/2 opacity-50 right-4 top-1/2"
                  />
                ) : (
                  <ArrowRight
                    size="20"
                    className="absolute -translate-y-1/2 opacity-50 right-4 top-1/2"
                  />
                )}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
