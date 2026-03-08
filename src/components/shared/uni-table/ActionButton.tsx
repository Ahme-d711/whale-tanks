import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconType } from "@/types";

/**
 * ActionButton helper for rendering a single action button
 */
export function ActionButton({ 
  icon: Icon, 
  onClick, 
  variant = "default" 
}: { 
  icon: IconType; 
  onClick?: () => void; 
  variant?: "default" | "danger" 
}) {
  return (
    <Button 
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "h-8 w-8 rounded-lg shrink-0 cursor-pointer",
        variant === "danger" 
          ? "text-error hover:bg-red-50 hover:text-error" 
          : "text-content-tertiary hover:bg-gray-100"
      )}
    >
      <Icon className="h-6! w-6!" />
    </Button>
  );
}
