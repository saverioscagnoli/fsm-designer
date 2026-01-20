import { useHotkey } from "@util-hooks/use-hotkey";
import { useTheme } from "./context/theme";
import { cn } from "~/lib/utils";
import { Topbar } from "~/components/topbar";
import { Viewport } from "~/components/viewport";
import { Properties } from "~/components/properties";
import { Structure } from "~/components/structure";
import { Bottombar } from "~/components/bottombar";

const App = () => {
  const { toggleTheme } = useTheme();

  useHotkey(window, ["ctrl"], "m", toggleTheme);

  return (
    <div className={cn("w-screen h-screen", "flex flex-col")}>
      <Topbar />
      <div className={cn("w-full h-[calc(100vh-3rem)]", "relative flex")}>
        <Structure />
        <Viewport />
        <Properties />
      </div>
      <Bottombar />
    </div>
  );
};

export { App };
