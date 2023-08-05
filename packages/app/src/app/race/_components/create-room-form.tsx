"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";

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
import { createRoomSchema } from "@/lib/validations/room";
import LanguageDropdown from "@/app/add-snippet/_components/language-dropdown";
import CopyButton from "@/components/ui/copy-button";
import { Icons } from "@/components/icons";
import type { User } from "next-auth";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Language } from "@/config/languages";

// import CopyButton from '@/components/CopyButton'

type CreateRoomForm = z.infer<typeof createRoomSchema>;

export const CreateRoomForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const roomId = uuidv4();

  const router = useRouter();

  const form = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      language: localStorage.getItem("codeLanguage") ?? "",
    },
  });

  function onSubmit({ language }: CreateRoomForm) {
    setIsLoading(true);
    socket.emit("UserCreateRoom", {
      roomId,
      // TODO: make typescript happy
      language: language as Language,
    });
  }

  React.useEffect(() => {
    socket.on("RoomCreated", (payload) => {
      router.push(`/race/${payload.roomId}`);
    });

    socket.on("SendNotification", (payload) => {
      toast({
        title: payload.title,
        description: payload.description,
        variant: payload.variant,
      });

      setIsLoading(false);
    });
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Language</FormLabel>
              <FormControl>
                <LanguageDropdown {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Room ID</p>

          <div className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full">
          {isLoading ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            "Create a room"
          )}
        </Button>
      </form>
    </Form>
  );
};
