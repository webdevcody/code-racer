import * as React from "react";
import { nanoid } from "nanoid";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createRoomSchema } from "@/lib/validations/room";
// import CopyButton from '@/components/CopyButton'

const getDefaultLanguage = () => {
  return "Typescript";
};

type CreateRoomForm = z.infer<typeof createRoomSchema>;

export const CreateRoomForm = ({ roomId }: { roomId: string }) => {
  const form = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      language: getDefaultLanguage(),
    },
  });

  function onSubmit({ language }: CreateRoomForm) {
    // setIsLoading(true);
    // socket.emit("create-room", { roomId, username });
  }

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
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* <div>
          <p className="mb-2 text-sm font-medium">Room ID</p>

          <div className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create a Room"
          )}
        </Button> */}
      </form>
    </Form>
  );
};
