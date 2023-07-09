"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChangeNameForm from "./change-name-form";

export default function ToggleChangeName() {
  const [edit, setEdit] = useState(false);
  return (
    <>
      <Button
        type="button"
        title="Edit username"
        variant={"outline"}
        onClick={() => setEdit(true)}
      >
        Edit username
      </Button>
      {
        edit ? (
          <div
            className="fixed inset-0 bg-monochrome-low-opacity w-full h-full z-20 grid place-items-center"
          >
            <div className="z-0 overflow-auto w-full h-full absolute inset-0" onClick={() => setEdit(false)} />
            <ChangeNameForm />
          </div>

        ) : null
      }
    </>
  );
};