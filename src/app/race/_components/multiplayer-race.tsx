"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { bruno_ace_sc } from "@/lib/fonts";

export default function MultiplayerRace() {
  const [selectedMultiplayerLanguage, setSelectedMultiplayerLanguage] =
    useState("");

  return (
    <Card className="flex flex-col justify-between flex-1 border-2 border-warning  ">
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
        <div className="grid items-center gap-2">
          <Link
            className={cn(
              buttonVariants({ variant: "black" }),
              true && "pointer-events-none cursor-not-allowed opacity-40",
            )}
            onClick={(e) => e.preventDefault()}
            href={`/race/multiplayer${
              selectedMultiplayerLanguage ? "?lang=" : ""
            }${encodeURIComponent(selectedMultiplayerLanguage)}`} // Make sure it is URL encoded
          >
            Start Racing (Coming Soon)
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
