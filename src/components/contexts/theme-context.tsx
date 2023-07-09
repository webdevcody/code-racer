"use client";

import type { ReactParentComponentProp } from "@/lib/types";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

type Theme = "dark" | "light" | "auto";

/** Just to avoid typo. */
const PREFERRED_THEME = "preferred-theme";

/** Interface for Theme Context. */
interface ThemeContextInterface {
  /**
   * Variable returned by useThemeContext() which contains the
   * value of the current theme, namely: "dark" | "light" | "auto".
   * @default "auto"
   */
  theme: Theme;
  /**
   * Function to change the current theme. This will also change
   * the theme value stored in a user's localStorage.
   * @param Theme "dark" | "light" | "auto"
   * @returns void
   */
  changeTheme: (theme: Theme) => void;
};

/** Please use the custom hook named, useThemeContext, if you are trying to use this context. */
export const ThemeContext = createContext<ThemeContextInterface>(
  /** Default value of Theme Context. */
  {
    theme: "auto",
    changeTheme: () => { }
  }
);

export const ThemeContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [theme, setTheme] = useState<Theme>("auto");

  const changeTheme = useCallback((theme: Theme) => {
    localStorage.setItem(PREFERRED_THEME, theme);
    setTheme(theme);
  }, [theme]);

  useEffect(() => {
    /** Get the html tag */
    const html = document.documentElement;

    /** Get the list of classes of the html tag. */
    const htmlClass = html.classList;

    /** Remove "dark" && "light" from the list of classes. */
    htmlClass.remove("dark", "light");

    /** Get the stored theme inside the user's localStorage. */
    const storedTheme = localStorage.getItem(PREFERRED_THEME) as Theme | undefined;
    
    /** If its value was set to "auto" or if it does not exist yet */
    if (storedTheme === "auto" || (!storedTheme)) {
      const query = "(prefers-color-scheme: dark)",
        mediaQuery = window.matchMedia(query);
        /** If the user's browser theme is set to dark. */
        if (mediaQuery.matches) {
          htmlClass.add("dark");
          html.style.colorScheme = "dark";
          setTheme("dark");
        } else {
          htmlClass.add("light");
          html.style.colorScheme = "light";
          setTheme("light")
        }
    } else if (storedTheme === "dark" || storedTheme === "light") {
      htmlClass.add(storedTheme);
      html.style.colorScheme = storedTheme;
      setTheme(storedTheme);
    };

  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};