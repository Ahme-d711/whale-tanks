import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  Bot,
  Server,
  CreditCard,
} from "lucide-react";
import type { IconType } from "@/types";

export interface NavItem {
  titleKey: string;
  href: string;
  icon: IconType;
}

export const navItems: NavItem[] = [
  {
    titleKey: "overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    titleKey: "subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    titleKey: "packages",
    href: "/dashboard/packages",
    icon: Package,
  },
  {
    titleKey: "providers",
    href: "/dashboard/providers",
    icon: Server,
  },
  {
    titleKey: "models",
    href: "/dashboard/models",
    icon: Bot,
  },
  {
    titleKey: "settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
