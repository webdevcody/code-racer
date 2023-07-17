"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { createPrivateRaceRoom } from "@/app/_actions/room";

export default function FriendsRace() {
  const [languagePrivate, setLanguagePrivate] = useState("");
  const { data: session } = useSession();
  const { toast } = useToast();

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
