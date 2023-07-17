"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { catchError} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { updateUserAction } from "@/app/_actions/user";
import { Icons } from "@/components/icons";

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

  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();

  async function onSubmit(data: UpdateUser) {
    setIsEditing(false);
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
        className="w-[75%] text-center mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                      <Input
                        className="text-2xl text-center font-bold border-2 hover:border-dashed hover:border-primary"
                        onFocus={() => setIsEditing(true)}
                        {...field}
                      />
                  {isEditing && (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          type="reset"
                          onClick={() => setIsEditing(false)}
                        >
                          <Icons.cross className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="success"
                          disabled={field.value === displayName || field.value === ""}
                          type="submit"
                        >
                          <Icons.check className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
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
