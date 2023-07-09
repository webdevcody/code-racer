"use client";
import {
  type FormEvent,
  useCallback,
  useState,
  useEffect
} from "react";
import ChangeNameButton from "./change-name-button";
import { Button } from "@/components/ui/button";

export default function DisplayNameComponent({
  displayName
}: {
  displayName: string;
}) {
  if (!displayName) {
    displayName = localStorage.getItem("displayName") as string;
  };
  const [newName, setNewName] = useState("");
  const [willEdit, setWillEdit] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /** Call some function to save this to database... */
    localStorage.setItem("displayName", newName);
    setWillEdit(false);
    setDidSubmit(true);
  }, [displayName, didSubmit]);
  /** Need to make dynamic funcs first,
   *  then edit this alot to make it cleaner, so it's like this for now.
   * This will definitely be better
   * in the future. This is just the initial UI.
   */

  /** Temporary solution to the side effect
   * when saving to prepare for next edit. */
    
  useEffect(() => {
    setDidSubmit(false);
    setNewName("");
    const name = localStorage.getItem("displayName");
    if (name) {
      setNewName(newName);
    }
  }, [didSubmit]);

  return (
    <>
      <h1 className="font-bold text-2xl 2xl:text-3xl">{displayName}</h1>
      <ChangeNameButton
        setWillEdit={setWillEdit}
      />
      {
        willEdit
          ? (
            <div
              className="fixed inset-0 bg-monochrome-low-opacity w-full h-full z-20 grid place-items-center"
            >
              <div className="z-0 overflow-auto w-full h-full absolute inset-0" onClick={() => {
                if (newName) {
                  setNewName("");
                };
                setWillEdit(false);
              }} />
              <form onSubmit={handleSubmit} className="z-10 w-[96%] p-6 h-44 max-w-[30rem] rounded-md shadow-monochrome shadow-lg bg-secondary flex flex-col justify-center gap-4">
                <div title="Type in new username">
                  <label htmlFor="username-input" className="block cursor-text rounded-sm relative w-full h-12 p-3 border-[1px] border-solid border-primary">
                    <span className={`bg-secondary h-fit absolute top-0 bottom-0 my-auto duration-100 ease-in-out transition-transform ${newName ? "-translate-x-[2%] -translate-y-full scale-90" : ""}`}>Edit your username</span>
                    <input
                      type="text"
                      onChange={(e) => setNewName(e.target.value)}
                      value={newName}
                      name="username-input"
                      id="username-input"
                      className="outline-none bg-transparent h-full w-full z-10 relative"
                      required
                      minLength={3}
                    />
                  </label>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant={"destructive"}
                    className="py-6 w-full text-lg"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          ) : null
      }
    </>
  );
};