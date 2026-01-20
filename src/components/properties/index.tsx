import { cn } from "~/lib/utils";

const Properties = () => {
  return (
    <div
      className={cn(
        "w-1/6 h-full",
        "absolute right-0 top-0 z-10",
        "bg-black/10 dark:bg-white/5",
        "backdrop-blur-md",
        "border-l border-l-(--gray-6)"
      )}
    >
      Properties
    </div>
  );
};

export { Properties };
