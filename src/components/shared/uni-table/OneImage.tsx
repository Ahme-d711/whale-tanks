import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * oneImage helper for rendering a cell with an avatar and a label
 */
export function oneImage(image?: string | null, label?: string) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={image || ""} alt={label} className="object-cover" />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
          {label?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      {label && <span className="font-semibold text-content-primary whitespace-nowrap">{label}</span>}
    </div>
  );
}
