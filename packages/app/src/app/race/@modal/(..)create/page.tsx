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
    <div className="bg-accent/2 fixed inset-0 z-10">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-lg bg-background px-2 py-2">
          <div className="absolute right-12 top-12 z-10">
            <CloseModal />
          </div>
          <div>
            <Card className="w-[90vw] max-w-[400px]">
              <CardHeader>
                <CardTitle>Scribble</CardTitle>
                <CardDescription>
                  Draw on the same canvas with your friends in real-time.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col space-y-4">
                <CreateRoomForm roomId={roomId} />

                <div className="flex items-center space-x-2 ">
                  <Separator />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <Separator />
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
      </div>
    </div>
  );
}
