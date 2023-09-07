
import type { RoomProps } from "./renderer";

import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

import { CreateRoomForm } from "../_components/create-room-form";
import { JoinRoomForm } from "../_components/join-room-form";

export const NotConnectedToRoomPage: React.FC<RoomProps> = ({ session }) => {

  return (
    <React.Fragment>
      <Heading
        typeOfHeading="h1"
        size="h1"
        title="The Race Track"
        description="Create or join a room and invite your friends!"
      />

      <section className="grid md:grid-cols-2 gap-8">
        <h2 className="sr-only">Section of cards</h2>
        <Card>
          <CardHeader>
            <CardTitle>Be the Room Master</CardTitle>
            <CardDescription>Create a room and invite your friends!</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <CreateRoomForm session={session} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Join a Room Master</CardTitle>
            <CardDescription>Join a room that your friends created!</CardDescription>
          </CardHeader>

          <CardContent>
            <JoinRoomForm session={session} />
          </CardContent>
        </Card>
      </section>
    </React.Fragment>
  );
};