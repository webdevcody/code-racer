/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { cn, throwError } from "@/lib/utils";
import { useToast } from "./use-toast";

export interface EditableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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
    const { toast } = useToast();

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
              // onBlur={() => {
              //   if (edit) {
              //     setNewValue(value);
              //     setEdit(false);
              //   }
              // }}
              autoFocus
              {...props}
            />
            <div className="absolute top-0 right-0 flex items-center justify-center w-24 h-full gap-2 bg-background">
              <button
                type="button"
                className="relative w-4 h-4"
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
                    toast({
                      title: "Username cannot be an empty string.",
                      description: "Your username cannot be an empty string.",
                      variant: "destructive",
                    });
                  }
                  if (newValue === value) {
                    throwError(new Error("name-is-the-same"));
                    toast({
                      title: "Same username as before.",
                      description:
                        "Oops look like your username is same as it was.",
                      variant: "middle",
                    });
                  }
                  setEdit(false);
                  await actionOnSave();
                  toast({
                    title: "Username successfully updated.",
                    description: "Your username has been successfully updated.",
                    variant: "default",
                  });
                }}
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
