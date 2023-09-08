import React from "react";
import Link from "next/link";
import { Users } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { cn } from "@/lib/utils";

const RaceRoomCard: React.FC = () => {
  return (
    <Card className="flex flex-col justify-between flex-1 border-2 border-warning">
      <CardHeader>
        <div className="grid text-center place-content-center">
          <Users className="justify-self-center" size={40} />
          <Heading
            title="Race Friends"
            description="Create or join a race track and prove who's the fastest among your friends!"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Link
          href="/race/rooms"
          className={cn(buttonVariants({ variant: "black" }), "w-full")}
        >
          Go now!
        </Link>
      </CardContent>
    </Card>
  );
};

export default React.memo(RaceRoomCard);
