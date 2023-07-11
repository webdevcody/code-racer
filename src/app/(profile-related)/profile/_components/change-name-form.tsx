"use client";
import { useRef } from "react";
import { updateUserAction } from "../actions";
import { throwError } from "@/lib/utils";
import { EditableInput } from "@/components/ui/editable-input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const session = useSession();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="w-[75%] text-center mb-1">
      <EditableInput
        value={displayName ?? "Llama1203x"}
        actionOnSave={async () => {
          if (inputRef) {
            const newName = inputRef.current?.value as string;
            try {
              await handleSubmit({
                newName,
                currentName: displayName as string,
              });
              /** to update the value returned by the useSession() hook. */
              await session.update({ name: newName });
              /** to reflect changes on the delete confirmation modal */
              router.refresh();
            } catch (e) {
              throwError(e as Error);
            }
          }
        }}
        ref={inputRef}
        className="text-2xl font-bold"
      />
    </div>
  );
}
