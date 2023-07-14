"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, User } from "lucide-react";
import Link from "next/link";
import LanguageDropDown from "../add-snippet/_components/language-dropdown";
import { createPrivateRaceRoom } from "../_actions/room";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export default function RacePage() {
  const [languageMultiplayer, setLanguageMultiplayer] = React.useState("");
  const [languageSinglePlayer, setLanguageSinglePlayer] = React.useState("");
  const [languagePrivate, setLanguagePrivate] = React.useState("");
  const { data: session } = useSession();
  const { toast } = useToast();

  return (
    <main className="max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Multiplayer</h2>
              <p>Race against other people and see who can type the fastest!</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center">
            <Button asChild>
              <Link
                href={`/race/multiplayer${
                  languageMultiplayer ? "?lang=" : ""
                }${encodeURIComponent(languageMultiplayer)}`} // Make sure it is URL encoded
              >
                Enter a typing race
              </Link>
            </Button>
            <LanguageDropDown
              className="w-fit"
              codeLanguage={languageMultiplayer}
              setCodeLanguage={setLanguageMultiplayer}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4 justify-between">
        <Card className="max-w-[50%] flex-1">
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
            <div className="flex gap-2 items-center">
              <Button asChild>
                <Link
                  href={`/race/practice${
                    languageSinglePlayer ? "?lang=" : ""
                  }${encodeURIComponent(languageSinglePlayer)}`} // Make sure it is URL encoded
                >
                  Practice yourself
                </Link>
              </Button>
              <LanguageDropDown
                className="w-fit"
                codeLanguage={languageSinglePlayer}
                setCodeLanguage={setLanguageSinglePlayer}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-[50%] flex-1 flex flex-col">
          <CardHeader className="h-full justify-center">
            <div className="flex items-center gap-4">
                <Users size={32} />
              <div>
                <h2 className="text-2xl font-bold">Race your friends</h2>
                <p>Create your own racetrack and play with friends</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => {
                  if (!session) {
                    toast({
                      title: "Unauthorized",
                      description:
                        "You need to be logged in to create a racetrack",
                    });
                    return;
                  }

                  createPrivateRaceRoom({
                    userId: session?.user.id,
                  });
                }}
              >
                Create racetrack
              </Button>
              <LanguageDropDown
                className="w-fit"
                codeLanguage={languagePrivate}
                setCodeLanguage={setLanguagePrivate}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
