"use client";

import { useRef } from "react";
import { EditableInput } from "@/components/ui/editable-input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateUserAction } from "../actions";

async function handleSubmit({
  newName,
  currentName,
}: {
  newName: string;
  currentName: string;
}) {
  if (newName === currentName) {
    throwError(
      new Error("The current username and the new one is still the same!"),
    );
  }
  await updateUserAction({ newName });
}

export default function ChangeNameForm({
  displayName,
}: {
  displayName: string | null | undefined;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    const newName = inputRef.current?.value as string;
    await updateUserAction({ newName });
    await session.update({ name: newName });
    router.refresh();
  }

  return (
    <div className="w-[75%] text-center mb-1">
      <EditableInput
        value={displayName as string}
        actionOnSave={handleSubmit}
        ref={inputRef}
        className="text-2xl font-bold"
      />
    </div>
  )
}
