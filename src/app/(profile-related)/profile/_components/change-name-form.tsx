"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { catchError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateUserAction } from "../../../_actions/user";

const updateUserSchema = z.object({
  name: z
    .string({
      required_error: "Please enter a username",
    })
    .nonempty("Please enter a username"),
});

type UpdateUser = z.infer<typeof updateUserSchema>;

export default function ChangeNameForm({
  displayName,
}: {
  displayName: string | null | undefined;
}) {
  const router = useRouter();
  const session = useSession();
  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    mode: "onSubmit",
    defaultValues: {
      name: displayName ?? "",
    },
  });

  const [isEditing, setIsEditing] = React.useState(false);

  const { toast } = useToast();

  async function onSubmit(data: UpdateUser) {
    try {
      await updateUserAction({ name: data.name });

      toast({
        title: "Username successfully updated.",
        description: "Your username has been successfully updated.",
        variant: "default",
      });

      await session.update({ name: data.name });

      router.refresh();
    } catch (error) {
      catchError(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[75%] text-center mb-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  <Input
                    className="text-2xl font-bold hover:border-dashed border hover:border-white"
                    onFocus={() => setIsEditing(true)}
                    {...field}
                  />
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="reset"
                        className="w-full"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="w-full">
                        Submit
                      </Button>
                    </div>
                  )}
                </>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
