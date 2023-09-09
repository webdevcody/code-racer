"use client";

import React from "react";
import { z } from "zod";

import { Check, ChevronsUpDown } from "lucide-react";

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

import { languageTypes } from "@/lib/validations/room";
import { cn } from "@/lib/utils";

type LanguageTypes = z.infer<typeof languageTypes>


const LanguageDropdown = ({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: LanguageTypes | undefined;
  onChange: (_props: React.SetStateAction<LanguageTypes | undefined>) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const itemToShow = React.useMemo(() => {
    if (value) {
      for (let idx = 0; idx < snippetLanguages.length; ++idx) {
        if (snippetLanguages[idx].value === value) {
          return snippetLanguages[idx].label;
        }
      }
    } else {
      return "Select language...";
    }
  }, [value]);

  React.useEffect(() => {
    if (localStorage) {
      const savedCodeLanguage = localStorage.getItem("codeLanguage");
      const parsedSavedCodeLanguage = languageTypes.parse(savedCodeLanguage);
      if (savedCodeLanguage) {
        onChange(parsedSavedCodeLanguage);
      }
    }
  }, [onChange]);

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
          {itemToShow}
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
                language.label.toLowerCase().includes(search.toLowerCase())
              )
              .map((language) => (
                <CommandItem
                  key={language.label}
                  value={language.value}
                  onSelect={(currentValue) => {
                    const parsedValue = languageTypes.parse(currentValue);
                    onChange(parsedValue);
                    window.localStorage.setItem(
                      "codeLanguage",
                      parsedValue,
                    );
                    setOpen(false);
                  }}
                  data-cy={`${language.value}-value`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      { "opacity-0": value !== language.value }
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

export default React.memo(LanguageDropdown);
