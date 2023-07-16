"use client";
import React, { SetStateAction, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, User } from "lucide-react";
import Link from "next/link";
import LanguageDropDown from "../add-snippet/_components/language-dropdown";
import { createPrivateRaceRoom } from "../_actions/room";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";

export default function RacePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  function RacePractice() {
    const [languageSinglePlayer, setLanguageSinglePlayer] = useState("");
    const [error, setError] = useState("");

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
                `/race/practice${
                  languageSinglePlayer ? "?lang=" : ""
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

  function RaceMultiplayer() {
    const [languageMultiplayer, setLanguageMultiplayer] = useState("");

    return (
      <Card className="text-gray-700">
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
          <div className="flex items-center gap-2">
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                true && "pointer-events-none cursor-not-allowed opacity-30",
              )}
              onClick={(e) => e.preventDefault()}
              href={`/race/multiplayer${
                languageMultiplayer ? "?lang=" : ""
              }${encodeURIComponent(languageMultiplayer)}`} // Make sure it is URL encoded
            >
              Start Racing (Coming Soon)
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  function RaceWithFriends() {
    const [languagePrivate, setLanguagePrivate] = useState("");

    return (
      <Card className="text-gray-700">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Users size={32} />
            <div>
              <h2 className="text-2xl font-bold">Race With Friends</h2>
              <p>Create your own racetrack and play with friends</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Button
            disabled
            onClick={() => {
              if (!session) {
                toast({
                  title: "Unauthorized",
                  description: "You need to be logged in to create a racetrack",
                });
                return;
              }

              createPrivateRaceRoom({
                userId: session?.user.id,
              });
            }}
          >
            Create Room (Coming Soon)
          </Button>
          {/* <LanguageDropDown
          className="w-fit"
          codeLanguage={languagePrivate}
          setCodeLanguage={setLanguagePrivate}
        /> */}
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="pt-12">
      <Heading
        title="Choose a Race Mode"
        description="Practice your typing skills by yourself, with friends, or with other soy devs online"
      />
      <div className="grid grid-cols-1 gap-8 my-8 lg:grid-cols-3">
        <RacePractice />
        <RaceMultiplayer />
        <RaceWithFriends />
      </div>
    </main>
  );
}
