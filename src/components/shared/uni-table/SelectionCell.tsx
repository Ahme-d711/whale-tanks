import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * Selection icon for a row
 */
export function SelectionCell({ 
  checked = false, 
  onChange,
  id 
}: { 
  checked?: boolean; 
  onChange?: (checked: boolean) => void;
  id?: string | number 
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox 
        checked={checked} 
        onCheckedChange={(val) => onChange?.(!!val)}
        className={cn(
          "rounded transition-colors shrink-0",
          checked ? "bg-primary border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white" : "border-divider bg-white"
        )} 
      />
      {id && <span className="font-semibold text-primary whitespace-nowrap">{id}</span>}
    </div>
  );
}
