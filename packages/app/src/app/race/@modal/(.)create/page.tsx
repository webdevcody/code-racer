"use client";

import { nanoid } from "nanoid";

import CloseModal from "@/components/close-modal";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CreateRoomForm } from "../../_components/create-room-form";

export default function CreateRoomModal() {
  const roomId = nanoid();

  return (
    <div className="fixed z-10">
        <div className="relative">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Race with friends</CardTitle>
              <CardDescription>
                Create or join a room to race with your friends in real-time.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col space-y-4">
              <CreateRoomForm roomId={roomId} />

              <div className="flex items-center space-x-2 w-full ">
                <Separator className="w-1/2" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="w-full" />
              </div>
              <Link
                href="/race/join"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Join Room
              </Link>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
