import {
  LayoutDashboard,
  Megaphone,
  Users,
  ShoppingCart,
  Settings,
  Package,
  Layers,
  Tag,
  Award,
  LayoutGrid,
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
    titleKey: "settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
