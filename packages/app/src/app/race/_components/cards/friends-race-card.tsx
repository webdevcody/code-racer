import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { bruno_ace_sc } from "@/lib/fonts";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FriendsRaceCard({ enabled }: { enabled: boolean }) {
  return (
    <Card className="flex flex-col justify-between flex-1 border-2 border-warning">
      <CardHeader>
        <div className="grid text-center place-content-center">
          <Users className="justify-self-center" size={40} />
          <div>
            <h2
              style={bruno_ace_sc.style}
              className="text-3xl font-bold text-warning"
            >
              Race Friends
            </h2>
            <p className="font-light">
              Create your own racetrack and play with friends
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid items-start grid-cols-2 gap-2">
        <Link
          href="/race/create"
          className={cn(buttonVariants({ variant: "black" }))}
        >
          Create Room
        </Link>
        <Link href="/race/join" className={cn(buttonVariants({ variant: "outline" }))}>
          Join Room
        </Link>
      </CardContent>
    </Card>
  );
}
