import { cn } from "@/lib/utils";

export function MenuIcon({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center justify-center gap-1.5", className)}>
      <span className="block h-[3px] w-9 rounded-full bg-current" />
      <span className="block h-[3px] w-6 rounded-full bg-current" />
      <span className="block h-[3px] w-9 rounded-full bg-current" />
    </span>
  );
}

