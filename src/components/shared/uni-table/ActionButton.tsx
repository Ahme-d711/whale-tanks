import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconType } from "@/types";

interface ActionButtonProps {
  icon: IconType;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

/**
 * ActionButton helper for rendering a single action button
 */
export function ActionButton({ icon: Icon, onClick, variant = "default", disabled }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-lg transition-colors",
        variant === "danger" 
          ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50" 
          : "text-content-tertiary hover:text-primary hover:bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-6! w-6!" />
    </Button>
  );
}
