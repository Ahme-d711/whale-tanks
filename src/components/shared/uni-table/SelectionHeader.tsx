import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * Selection icon for the header (e.g. "Select All" state)
 */
export function SelectionHeader({ 
  checked,
  indeterminate,
  onChange,
  label 
}: { 
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string 
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox 
        checked={checked} 
        onCheckedChange={(val) => onChange?.(!!val)}
        className={cn(
          "rounded transition-colors shrink-0",
          (checked || indeterminate) 
            ? "bg-primary border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white" 
            : "border-divider bg-white"
        )} 
      />
      {label && <span className="whitespace-nowrap">{label}</span>}
    </div>
  );
}
