import { cn } from "~/lib/utils";

const Structure = () => {
  return (
    <div
      className={cn(
        "w-1/7 h-full",
        "absolute left-0 top-0 z-10",
        "bg-black/10 dark:bg-white/5",
        "backdrop-blur-md",
        "border-r border-r-(--gray-6)"
      )}
    >
      Structure
    </div>
  );
};

export { Structure };
