"use client";

import { Card } from "./ui/card";
import LanguageSelector from "./shared/LanguageSelector";
import { UserMenu } from "./UserMenu";
import { SearchInput } from "./shared/SearchInput";

export function DashboardNavbar() {
  return (
    <nav className="w-full relative z-50 overflow-visible!">
      <Card className="flex items-center justify-between border-none bg-transparent py-0 flex-row p-0 shadow-none overflow-visible!">
        {/* Left Side: Search */}
        <SearchInput className="w-full" />

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <div className="h-8 w-px bg-divider mx-2" />
          {/* User Profile & Logout */}
          <UserMenu />
        </div>
      </Card>
    </nav>
  );
}

