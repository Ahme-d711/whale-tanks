"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { navItems } from "@/constants/navigation";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tSidebar = useTranslations("Sidebar");
  const [text, setText] = useState(searchParams.get("search") || "");
  const [query] = useDebounce(text, 500);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/dashboard";

  // Filter sidebar items for quick navigation - Only on Home page
  const filteredNavItems = (text.trim() && isHome) 
    ? navItems.filter(item => 
        tSidebar(item.titleKey).toLowerCase().includes(text.toLowerCase())
      )
    : [];

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentSearch = currentParams.get("search") || "";
    
    if (currentSearch === query) return;

    if (query) {
      currentParams.set("search", query);
    } else {
      currentParams.delete("search");
    }
    
    const newPath = `${pathname}?${currentParams.toString()}`;
    router.replace(newPath, { scroll: false });
  }, [query, pathname, router, searchParams]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => {
    setText("");
    setShowDropdown(false);
  };

  return (
    <div className={cn("relative flex-1 group", className)} ref={containerRef}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        placeholder={tSidebar("search") || "Search products, categories..."}
        className="w-full rounded-2xl border shadow-none bg-white border-divider pl-11 h-14 focus-visible:ring-primary/20 transition-all"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        {...props}
      />

      {/* Quick Navigation Results */}
      {showDropdown && filteredNavItems.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-divider rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <h4 className="px-3 py-2 text-xs font-bold text-content-tertiary uppercase tracking-wider">
              {tSidebar("quick_navigation") || "Quick Navigation"}
            </h4>
            <div className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleItemClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary text-content-primary hover:text-primary transition-all group/item"
                  >
                    <div className="bg-gray-50 p-2 rounded-lg group-hover/item:bg-white transition-colors">
                      <Icon className="h-4 w-4 text-content-secondary group-hover/item:text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{tSidebar(item.titleKey)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


