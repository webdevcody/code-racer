import type { NextPage } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

import { CreateRoomForm } from "../_components/create-room-form";
import { JoinRoomForm } from "../_components/join-room-form";

const RaceRoomPage: NextPage = () => {

  return (
    <main className="flex flex-col gap-8 py-8">
      <Heading
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
            <CreateRoomForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Join a Room Master</CardTitle>
            <CardDescription>Join a room that your friends created!</CardDescription>
          </CardHeader>

          <CardContent>
            <JoinRoomForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default RaceRoomPage;