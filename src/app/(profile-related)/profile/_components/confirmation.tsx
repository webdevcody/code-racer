"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { throwError } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";
import { deleteUserAction } from "../actions";

export default function DeleteConfirmation({
  setWillDelete,
  displayName,
  uid,
}: {
  setWillDelete: React.Dispatch<React.SetStateAction<boolean>>;
  displayName: string;
  uid: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = () => setWillDelete(false);
    const el = divRef.current;
    if (!el) return;
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [divRef, setWillDelete]);

  return (
    <div className="fixed inset-0 z-10 grid w-full h-full place-items-center bg-monochrome-with-bg-opacity bg-opacity-5">
      <div className="absolute inset-0 w-full h-full -z-10" ref={divRef} />
      <div className="w-[95%] max-w-[22.5rem]">
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="relative w-6 h-6 hover:bg-monochrome-with-bg-opacity bg-opacity-10"
            onClick={() => setWillDelete(false)}
            title="Revert Changes"
          >
            <i className="absolute w-full h-[0.1rem] bg-monochrome left-0 top-1/2 -translate-y-1/2 rotate-[50deg]" />
            <i className="absolute w-full h-[0.1rem] bg-monochrome left-0 top-1/2 -translate-y-1/2 rotate-[-50deg]" />
          </button>
        </div>
        <div className="bg-background  min-h-[12.5rem] mt-2 rounded-lg p-6">
          <span className="flex items-center justify-center gap-2 text-red-500">
            <AlertTriangle className="stroke-red-500" />
            DELETE ACCOUNT
            <AlertTriangle className="stroke-red-500" />
          </span>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const response = await deleteUserAction({ userId: uid });
              if (response?.status === 401) {
                throwError(new Error("Something went wrong!"));
              }
              await signOut({
                callbackUrl: "/",
              });
            }}
            className="mt-4 select-none flex flex-col gap-2"
          >
            <p>Please type &quot;{displayName}&quot; to confirm:</p>
            <Input
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your username to confirm"
              value={inputValue}
              required
            />
            <Button
              variant={"destructive"}
              className="mt-2"
              tabIndex={inputValue === displayName ? 0 : -1}
              title={
                inputValue === displayName
                  ? "Delete your account"
                  : "Please type in your username"
              }
              disabled={inputValue === displayName ? undefined : true}
            >
              CONFIRM
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
