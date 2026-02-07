import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("container mx-auto px-4 max-w-6xl", className)} {...props} />;
}

