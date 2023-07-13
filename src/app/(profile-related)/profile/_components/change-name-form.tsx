"use client";

import { FormEvent, useRef } from "react";
import { Controls, EditableInput } from "@/components/ui/editable-input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateUserAction } from "../actions";
import { useToast } from "@/components/ui/use-toast";
import { ValidationError } from "@/lib/exceptions/custom-hooks";

export default function ChangeNameForm({
  displayName,
}: {
  displayName: string | null | undefined;
}) {
  const router = useRouter();
  const session = useSession();
  const controlsRef = useRef<Controls>({
    setEdit: (isEdit: boolean) => undefined,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newName = inputRef.current?.value as string;

    if (!newName) {
      return toast({
        title: "Username cannot be an empty string.",
        description: "Your username cannot be an empty string.",
        variant: "destructive",
      });
    } else if (newName === session.data?.user.name) {
      return toast({
        title: "Same username as before.",
        description: "Oops look like your username is same as it was.",
        variant: "middle",
      });
    }

    controlsRef.current.setEdit(false);
    try {
      await updateUserAction({ name: newName });

      toast({
        title: "Username successfully updated.",
        description: "Your username has been successfully updated.",
        variant: "default",
      });

      await session.update({ name: newName });
      router.refresh();
    } catch (err) {
      const error = err as unknown as ValidationError;
      const errors = JSON.parse(error.message);
      return toast({
        title: error.name,
        description: `The name field ${errors["name"]}`,
        variant: "middle",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[75%] text-center mb-4 hover:border-dashed border hover:border-white"
    >
      <EditableInput
        controls={controlsRef}
        value={displayName as string}
        ref={inputRef}
        className="text-2xl font-bold"
      />
    </form>
  );
}
