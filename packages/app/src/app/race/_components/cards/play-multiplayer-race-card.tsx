"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Users } from "lucide-react";

import LanguageDropdown from "@/app/add-snippet/_components/language-dropdown";

import { cn } from "@/lib/utils";
import { LanguageType } from "@/lib/validations/room";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

type Props = {
  enabled: boolean;
};

const PlayMultiplayerRaceCard: React.FC<Props> = ({ enabled }) => {
  const [language, setLanguage] = React.useState<LanguageType | undefined>();
  const [error, setError] = React.useState<string | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enabled) {
      return;
    }
    setError("");
    setIsLoading(true);
    if (!language) {
      setError("Please select a language.");
      return;
    }
    const searchQuery = "?lang=" + encodeURIComponent(language);
    router.push("/race/multiplayer" + searchQuery);
    setIsLoading(false);
  };

  return (
    <Card className="flex flex-col justify-between flex-1 border-2 border-warning">
      <CardHeader>
        <div className="grid text-center place-content-center">
          <Users className="justify-self-center" size={40} />
          <Heading
            title="Multiplayer"
            description="Race against other people and see who can type the fastest!"
          />
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className={cn({
            "grid items-start grid-cols-2 gap-2": enabled,
            "grid items-center gap-2": !enabled,
          })}
        >
          {!enabled && (
            <Button className="w-full" variant="black" disabled>
              Create Room (Coming Soon)
            </Button>
          )}

          {enabled && (
            <React.Fragment>
              <div className="flex flex-col">
                <LanguageDropdown
                  className={cn(
                    "w-full",
                    buttonVariants({ variant: "ghost" }),
                    { "border-destructive": error }
                  )}
                  value={language}
                  onChange={setLanguage}
                />
                <span className="text-red-500">{error}</span>
              </div>
              <Button
                disabled={
                  !enabled || isLoading || language === undefined
                }
                variant="black"
                className="relative justify-start border"
              >
                Start Racing
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
            </React.Fragment>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default React.memo(PlayMultiplayerRaceCard);