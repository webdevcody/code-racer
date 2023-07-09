import { ContextDoesNotExistError } from "@/lib/exceptions";
import { throwError } from "@/lib/utils";
import { ThemeContext } from "../contexts/theme-context";
import { useContext } from "react";

export default function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) throwError(new ContextDoesNotExistError());
  return context;
};