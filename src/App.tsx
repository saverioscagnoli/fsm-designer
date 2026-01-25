import { useHotkey } from "@util-hooks/use-hotkey";
import { useTheme } from "~/context/theme";
import { cn } from "~/lib/utils";
import { Viewport } from "~/components/viewport";
import { Topbar } from "~/components/topbar";

const App = () => {
  const { toggleTheme } = useTheme();

  useHotkey(window, ["ctrl"], "m", toggleTheme);

  return (
    <div className={cn("w-screen h-screen", "flex flex-col")}>
      <Topbar />
      <Viewport />
    </div>
  );
};

export { App };
