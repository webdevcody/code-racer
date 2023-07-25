"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { snippetLanguages } from "@/config/languages";

const LanguageDropDown = ({
  codeLanguage,
  setCodeLanguage,
  className,
}: {
  codeLanguage: string;
  setCodeLanguage: (event: string) => void;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    const savedCodeLanguage = window.localStorage.getItem("codeLanguage");
    if (savedCodeLanguage) {
      setCodeLanguage(savedCodeLanguage);
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between w-full px-4 py-3", className)}
        >
          {codeLanguage
            ? snippetLanguages.find(
                (language) => language.value === codeLanguage,
              )?.label
            : "Select language..."}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 h-44">
        <Command>
          <CommandInput
            placeholder="Search a Language..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            {snippetLanguages
              .filter((language) =>
                language.label.toLowerCase().includes(search.toLowerCase()),
              )
              .map((language) => (
                <CommandItem
                  key={language.label}
                  value={language.value}
                  onSelect={(currentValue) => {
                    const newCodeLanguage =
                      currentValue === codeLanguage ? "" : currentValue;
                    setCodeLanguage(newCodeLanguage);
                    window.localStorage.setItem(
                      "codeLanguage",
                      newCodeLanguage,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      codeLanguage === language.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageDropDown;
