import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from "react";

type Theme = "dark" | "light";

type ThemeContextT = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextT | null>(null);

const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark");
  }, [theme]);

  return (
    <ThemeContext.Provider
      children={children}
      value={{ theme, setTheme, toggleTheme }}
    />
  );
};

const useTheme = (): ThemeContextT => {
  let ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used between a ThemeProvider.");
  }

  return ctx;
};

export { ThemeContextProvider, useTheme };
export type { Theme, ThemeContextT };
