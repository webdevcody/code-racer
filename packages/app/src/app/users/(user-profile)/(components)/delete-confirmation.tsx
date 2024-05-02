//This will run on client-side
"use client"; 


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react"; //Built in authenticatin function from next-auth
import { AlertTriangle } from "lucide-react";
import { catchError } from "@/lib/utils";
import { deleteUserAction } from "./actions"; //deleteUserAction function from actions.ts 

// This is rendering the delete confirmation dialog box 
export default function DeleteConfirmation({
  // Props:
  setWillDelete, 
  displayName, 
}: {
  // Type definition for props
  setWillDelete: React.Dispatch<React.SetStateAction<boolean>>; // Function to set the deletion action state
  displayName: string; // Display name of the user account
}) {
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [inputValue, setInputValue] = useState(""); 
  const divRef = useRef<HTMLDivElement>(null); // Reference to a styling

  useEffect(() => {
    // Effect to handle clicks outside the confirmation dialog
    const onClick = () => setWillDelete(false); // Function to set deletion action state to false
    const el = divRef.current; // Get the div element reference
    if (!el) return; // Return if the element is not found
    el.addEventListener("click", onClick); // Add click event listener
    return () => el.removeEventListener("click", onClick); // Remove click event listener on cleanup
  }, [divRef, setWillDelete]); // Dependencies for effect

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    // Function to handle delting account 
    setIsLoading(true); // Set loading state to true
    e.preventDefault(); // Prevent default form submission
    try {
      await deleteUserAction({}); // Call delete user action - this is what we need to edit
      await signOut({ // Call sign out function after deleting the user
        callbackUrl: "/", // Redirect home after deletion
      });
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  }

  return (
    // Render the confirmation dialog
    <div className="fixed inset-0 z-10 grid w-full h-full place-items-center bg-monochrome-with-bg-opacity bg-opacity-5">
      <div className="absolute inset-0 w-full h-full -z-10" ref={divRef} />
      <div className="w-[95%] max-w-[22.5rem]">
        <div className="flex items-center justify-end"></div>
        <div className="bg-background  min-h-[12.5rem] mt-2 rounded-lg p-6">
          <span className="flex items-center justify-center gap-2 text-red-500">
            <AlertTriangle className="stroke-red-500" />
            DELETE ACCOUNT
            <AlertTriangle className="stroke-red-500" />
          </span>
          {/* Confirmation form */}
          <form
            className="flex flex-col gap-2 mt-4 select-none"
            onSubmit={handleDelete} // Submit event handler for deletion
          >
            {/* Type the username to confirm deleting profile - basic github protocol */}
            <p>
              Please type &quot;<span className="break-all">{displayName}</span>
              &quot; to confirm:
            </p>
            
            <Input
              type="text"
              name="name"
              onChange={(e) => setInputValue(e.target.value)} // Input change handler
              placeholder="Type your username to confirm"
              value={inputValue}
              required
            />
            {/* Button for confirmation */}
            <Button
              variant={"destructive"}
              className="mt-2"
              tabIndex={inputValue === displayName ? 0 : -1} // Tab index based on input value
              title="Delete your account"
              disabled={
                (inputValue === displayName ? undefined : true) || isLoading // Disable button based on input value and loading state
              }
            >
              {isLoading ? "DELETING..." : "CONFIRM"} {/* Button text */}
            </Button>
            {/* Cancel button */}
            <Button
              className="text-accent"
              onClick={() => setWillDelete(false)} // Cancel action 
            >
              CANCEL
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
