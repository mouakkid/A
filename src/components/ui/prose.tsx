import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("prose-editorial max-w-3xl", className)}>{children}</div>;
}
