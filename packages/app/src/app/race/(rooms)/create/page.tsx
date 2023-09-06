import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateRoomForm } from "@/app/race/_components/create-room-form";
import { NoHistoryButton } from "@/components/no-history-button";
import { env } from "@/env.mjs";
import { Fragment } from "react";

export const dynamic = "force-dynamic";

export default async function CreateRoomPage({ }) {
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
              <CreateRoomForm />

              <NoHistoryButton variant={"ghost"} path="/race/join">
                Join a Room
              </NoHistoryButton>
            </Fragment>
          ) : undefined}
        </CardContent>
      </Card>
    </div>
  );
}
