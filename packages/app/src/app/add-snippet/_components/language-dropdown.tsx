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

const LanguageDropdown = ({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange: (props: React.SetStateAction<string>) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    const savedCodeLanguage = window.localStorage.getItem("codeLanguage");
    if (savedCodeLanguage) {
      onChange(savedCodeLanguage);
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
          data-cy="language-dropdown"
        >
          {value
            ? snippetLanguages.find((language) => language.value === value)
                ?.label
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
            data-cy="search-language-input"
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
                      currentValue === value ? "" : currentValue;
                    onChange(newCodeLanguage);
                    window.localStorage.setItem(
                      "codeLanguage",
                      newCodeLanguage,
                    );
                    setOpen(false);
                  }}
                  data-cy={`${language.value}-value`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === language.value ? "opacity-100" : "opacity-0",
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

LanguageDropdown.displayName = "LanguageDropdown";

export default LanguageDropdown;
