"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-x border-divider bg-background sticky top-0">
    <h1 className="text-lg font-bold text-primary px-6 py-4">{t("title")}</h1>
      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = isItemActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-secondary text-primary border-l-4 border-primary rtl:border-l-0 rtl:border-r-4"
                  : "text-content-tertiary hover:bg-secondary hover:text-primary"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-primary" : "text-content-tertiary group-hover:text-primary"
                )}
              />
              <span className="text-base">{t(item.titleKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="p-6">
        <Image src="/dashboard-logo.svg" alt="logo" width={180} height={185} />
      </div>
    </aside>
  );
}


