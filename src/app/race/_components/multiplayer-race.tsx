"use client"
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

export default function MultiplayerRace() {
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
              true && "pointer-events-none cursor-not-allowed opacity-40",
            )}
            onClick={(e) => e.preventDefault()}
            href={`/race/multiplayer${languageMultiplayer ? "?lang=" : ""
              }${encodeURIComponent(languageMultiplayer)}`} // Make sure it is URL encoded
          >
            Start Racing (Coming Soon)
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
