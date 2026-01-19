import { createRoot } from "react-dom/client";
import { App } from "~/App";
import { ThemeContextProvider } from "~/context/theme";

import "~/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
);
