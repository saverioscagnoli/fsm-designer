import { createRoot } from "react-dom/client";
import { App } from "~/App";
import { ThemeContextProvider } from "~/context/theme";

import "~/index.css";
import "katex/dist/katex.min.css";
import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";

createRoot(document.getElementById("root")!).render(
  <ThemeContextProvider>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </ThemeContextProvider>
);
