"use client";

import { FormEvent, useRef } from "react";
import { Controls, EditableInput } from "@/components/ui/editable-input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateUserAction } from "../../../_actions/user";
import { useToast } from "@/components/ui/use-toast";
import { catchError } from "@/lib/utils";

export default function ChangeNameForm({
  displayName,
}: {
  displayName: string | null | undefined;
}) {
  const router = useRouter();
  const session = useSession();
  const controlsRef = useRef<Controls>({
    setEdit: () => undefined,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newName = inputRef.current?.value as string;

    if (newName === displayName) {
      controlsRef.current.setEdit(false);
      return;
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
      catchError(err);
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
