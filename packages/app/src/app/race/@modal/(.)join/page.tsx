import CloseModal from "@/components/close-modal";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinRoomForm } from "@/app/race/_components/join-room-form";
import { NoHistoryButton } from "@/components/no-history-button";
import { env } from "@/env.mjs";
import { Fragment } from "react";

export const dynamic = "force-dynamic";

export default async function JoinRoomModal() {
  return (
    <div className="fixed inset-0 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto relative">
        <div className="relative">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
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
                  <NoHistoryButton variant={"ghost"} path="/race/create">Create Room</NoHistoryButton>
                </Fragment>
              ) : undefined}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
