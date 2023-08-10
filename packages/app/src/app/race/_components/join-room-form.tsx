"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { joinRoomSchema } from "@/lib/validations/room";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import type { User } from "next-auth";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
// import CopyButton from '@/components/CopyButton'

type JoinRoomForm = z.infer<typeof joinRoomSchema>;

export const JoinRoomForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const form = useForm<JoinRoomForm>({
    resolver: zodResolver(joinRoomSchema),
  });

  function onSubmit({ roomId }: JoinRoomForm) {
    setIsLoading(true);
    router.push(`/race/${roomId}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Room id</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-2 w-full">
          {isLoading ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            "Join a room"
          )}
        </Button>
      </form>
    </Form>
  );
};
