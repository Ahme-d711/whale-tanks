import * as React from "react";

/**
 * ActionCell helper for rendering a group of action buttons
 */
export function ActionCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 justify-center">
      {children}
    </div>
  );
}
