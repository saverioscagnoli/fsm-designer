import { cn } from "~/lib/utils";

const Topbar = () => {
  return (
    <div
      className={cn("w-screen h-12", "border-b border-b-(--gray-6)", "z-10")}
    ></div>
  );
};

export { Topbar };
