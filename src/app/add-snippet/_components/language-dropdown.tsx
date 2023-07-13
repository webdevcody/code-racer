"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const snippetLangs: { label: string; value: string }[] = [
    { label: "C/C++", value: "c_cpp" },
    { label: "C#", value: "csharp" },
    { label: "Go", value: "go" },
    { label: "HTML", value: "html" },
    { label: "Java", value: "java" },
    { label: "Javascript", value: "javascript" },
    { label: "PHP", value: "php" },
    { label: "Python", value: "python" },
    { label: "Ruby", value: "ruby" },
    { label: "Swift", value: "swift" },
    { label: "Typescript", value: "typescript" },
  ];
  

const LanguageDropDown = ({ codeLanguage, setCodeLanguage }: { codeLanguage: string , setCodeLanguage: React.Dispatch<React.SetStateAction<string>>}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full px-4 py-3"
        >
          {codeLanguage
            ? snippetLangs.find((language) => language.value === codeLanguage)?.label
            : "Select language..."}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 ">
        <Command>
          <CommandInput placeholder="Search a Language..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {snippetLangs.map((language) => (
              <CommandItem
                key={language.value}
                onSelect={(currentValue) => {
                  setCodeLanguage(currentValue === codeLanguage ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    codeLanguage === language.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {language.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default LanguageDropDown;
