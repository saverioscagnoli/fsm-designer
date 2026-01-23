import { useHotkey } from "@util-hooks/use-hotkey";
import { useTheme } from "~/context/theme";
import { cn } from "~/lib/utils";
import { Viewport } from "~/components/viewport";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } }
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

const App = () => {
  const { toggleTheme } = useTheme();

  useHotkey(window, ["ctrl"], "m", toggleTheme);

  return (
    <div className={cn("w-screen h-screen", "flex flex-col", "smooth-colors")}>
      <Viewport />
    </div>
  );
};

export { App };
