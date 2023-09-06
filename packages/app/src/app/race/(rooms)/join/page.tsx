import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinRoomForm } from "@/app/race/_components/join-room-form";
import { NoHistoryButton } from "@/components/no-history-button";
import { Fragment } from "react";
import { env } from "@/env.mjs";

export const dynamic = "force-dynamic";

export default async function JoinRoomPage({ }) {
  return (
    <div className="flex items-center justify-center">
      <Card>
        <CardHeader>
          {env.NODE_ENV === "development" ? (
            <Fragment>
              <CardTitle>Race with friends</CardTitle>
              <CardDescription>
                Create or join a room to race with your friends in real-time.
              </CardDescription>
            </Fragment>
          ) : (
            <Fragment>
              <CardTitle>Under maintenance</CardTitle>
              <CardDescription>This feature is currently being fixed. Please Come again later.</CardDescription>
            </Fragment>
          )}
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          {env.NODE_ENV === "development" ? (
            <Fragment>
              <JoinRoomForm />
              <NoHistoryButton variant={"ghost"} path="/race/create">
                Create Room
              </NoHistoryButton>
            </Fragment>
          ) : undefined}
        </CardContent>
      </Card>
    </div>
  );
}
