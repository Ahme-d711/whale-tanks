import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

/**
 * StatusSelectCell helper for rendering a status dropdown with colors
 */
export function StatusSelectCell({
  value,
  onValueChange,
  options,
  colorMap,
  t,
  className
}: {
  value: string;
  onValueChange: (newValue: string) => void;
  options: string[];
  colorMap: Record<string, string>;
  t: (key: string) => string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger 
        className={cn(
          "h-8 w-[130px] border px-3 py-1 rounded-lg font-medium shadow-none transition-colors",
          colorMap[value] || "bg-gray-100 text-gray-600 border-gray-200",
          className
        )}
      >
        <SelectValue>
          {t(value.toLowerCase())}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem 
            key={option} 
            value={option}
            className={cn(
              "flex items-center gap-2",
              colorMap[option] ? `focus:${colorMap[option]} data-[state=checked]:${colorMap[option]}` : ""
            )}
          >
            <div className={cn("size-2 rounded-full", colorMap[option]?.split(" ")[0] || "bg-gray-400")} />
            {t(option.toLowerCase())}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
