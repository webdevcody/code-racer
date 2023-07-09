import { ThemeContextProvider } from "./theme-context";

/** Provides all the main contexts that will be used globally. */
export default function ContextProvider({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <ThemeContextProvider>
      {children}
    </ThemeContextProvider>
  );
};