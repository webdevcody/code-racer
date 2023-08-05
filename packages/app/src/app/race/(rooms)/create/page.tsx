import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateRoomForm } from "@/app/race/_components/create-room-form";
import { NoHistoryButton } from "@/components/no-history-button";

export const dynamic = "force-dynamic";

export default async function CreateRoomPage({}) {
  return (
    <div className="flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Race with friends</CardTitle>
          <CardDescription>
            Create or join a room to race with your friends in real-time.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <CreateRoomForm/>

          <NoHistoryButton variant={"ghost"} path="/race/join">
            Join a Room
          </NoHistoryButton>
        </CardContent>
      </Card>
    </div>
  );
}
