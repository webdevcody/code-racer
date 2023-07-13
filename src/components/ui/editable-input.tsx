/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import React, {  RefObject } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export type Controls = {
  setEdit: (isEdit: boolean) => void;
};

const EditableInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>  & {
  controls: RefObject<Controls>
}>(
  ({ className, type, value, controls, ...props }, ref) => {
    const [edit, setEdit] = React.useState(false);
    const [newValue, setNewValue] = React.useState(value);
    const divRef = React.useRef<HTMLDivElement>(null);
    
    if (controls.current) {
      controls.current.setEdit = (isEdit: boolean) => {
        setEdit(isEdit)
      }
    }

    React.useEffect(() => {
      const onClickEdit = () => setEdit(true);
      const el = divRef.current;
      if (!el) return;
      el.addEventListener("click", onClickEdit);
      return () => el.removeEventListener("click", onClickEdit);
    }, [edit, divRef]);

    return (
      <div className="relative rounded-md ring-offset-background">
        {edit ? (
          <>
            <label htmlFor="change-text-input" className="sr-only">
              {newValue}
            </label>
            <Input
              type={type}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Please provide a value!"
              ref={ref}
              className={cn(
                "border-0 ring-offset-0 placeholder:text-sm",
                className,
                "text-base",
              )}
              autoFocus
              {...props}
            />
            <div className="mt-2 absolute top-11 right-0 flex items-center w-full justify-evenly h-full gap-2 bg-background">
              <Button
                type="button"
                onClick={() => {
                  setNewValue(value);
                  setEdit(false);
                }}
                variant={"ghost"}
                title="Revert Changes"
              >
                Cancel
              </Button>

              <Button
                variant={"default"}
              >
                Save
              </Button>
            </div>
          </>
        ) : (
          <div
            ref={divRef}
            title={`Click to change the text: ${value}`}
            role="button"
            className={cn(
              "bg-background h-fit px-3 py-2 w-full text-base overflow-hidden",
              className,
            )}
          >
            {newValue}
          </div>
        )}
      </div>
    );
  },
);

export { EditableInput };
