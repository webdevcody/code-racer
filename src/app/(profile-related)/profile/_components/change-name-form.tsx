"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { updateUserAction } from "../actions";
import { throwError } from "@/lib/utils";
import { EditableInput } from "@/components/ui/editable-input";

async function handleSubmit({
  newName,
  currentName,
}: {
  newName: string;
  currentName: string;
}) {
  if (newName === currentName) {
    throwError(
      new Error("The current username and the new one is still the same!")
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
  return (
    <div className="w-[75%] text-center mb-1">
      <EditableInput
        value={displayName ?? "Llama1203x"}
        actionOnSave={async () => {
          if (inputRef) {
            await handleSubmit({
              newName: inputRef.current?.value as string,
              currentName: displayName as string,
            });
            router.refresh();
          }
        }}
        ref={inputRef}
        className="text-2xl font-bold"
      />
    </div>
  );
}
