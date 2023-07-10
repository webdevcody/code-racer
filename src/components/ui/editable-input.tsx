/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import React from "react";
import { Input, InputProps } from "./input";
import { Button } from "./button";
import { cn, throwError } from "@/lib/utils";

export interface EditableInputProps extends InputProps {
  /** How would you like to save the text? */
  actionOnSave: () => Promise<void>;
}

/** Provide a ref to this component to access its value for submission.
 *
 * @param actionOnSave
 * @param value to show text
 */
const EditableInput = React.forwardRef<HTMLInputElement, EditableInputProps>(
  ({ className, type, value, actionOnSave, ...props }, ref) => {
    const [edit, setEdit] = React.useState(false);
    const [newValue, setNewValue] = React.useState(value);
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const onClickEdit = () => setEdit(true);
      const el = divRef.current;
      if (!el) return;
      el.addEventListener("click", onClickEdit);
      return () => el.removeEventListener("click", onClickEdit);
    }, [edit, divRef]);

    return (
      <div className="relative rounded-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                "text-base"
              )}
              // onBlur={() => {
              //   if (edit) {
              //     setNewValue(value);
              //     setEdit(false);
              //   }
              // }}
              autoFocus
              {...props}
            />
            <div className="absolute items-center justify-center flex gap-2 right-0 h-full w-24 top-0 bg-background">
              <button
                type="button"
                className="w-4 h-4 relative"
                onClick={() => {
                  setNewValue(value);
                  setEdit(false);
                }}
                title="Revert Changes"
              >
                <i className="absolute w-full h-[0.1rem] bg-monochrome left-0 top-1/2 -translate-y-1/2 rotate-[50deg]" />
                <i className="absolute w-full h-[0.1rem] bg-monochrome left-0 top-1/2 -translate-y-1/2 rotate-[-50deg]" />
              </button>

              <Button
                variant={"ghost"}
                onClick={async () => {
                  if (!newValue) {
                    throwError(new Error("Empty strings are not allowed!"));
                  }
                  setEdit(false);
                  await actionOnSave();
                }}
              >
                Save
              </Button>
            </div>
          </>
        ) : (
          <div
            ref={divRef}
            title={`Change current username: ${value}`}
            role="button"
            className={cn(
              "bg-background h-10 px-3 py-2 w-full text-base",
              className
            )}
          >
            {newValue}
          </div>
        )}
      </div>
    );
  }
);

export { EditableInput };
