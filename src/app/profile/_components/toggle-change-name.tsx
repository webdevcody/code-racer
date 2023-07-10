"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import ChangeNameForm from "./change-name-form";

export default function ToggleChangeName() {
  const [edit, setEdit] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickModalBackground = () => {
      console.log("here");
      setEdit(false);
    };
    const el = ref.current;
    if (!el) return;
    el.addEventListener("click", onClickModalBackground);
    return () => {
      el.removeEventListener("click", onClickModalBackground);
    };
  }, [ref, edit]);

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
      {edit ? (
        <div className="fixed inset-0 bg-monochrome-low-opacity w-full h-full z-20 grid place-items-center">
          <div
            ref={ref}
            className="z-0 overflow-auto w-full h-full absolute inset-0"
          />
          <ChangeNameForm />
        </div>
      ) : null}
    </>
  );
}
