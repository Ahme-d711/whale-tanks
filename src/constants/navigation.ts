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
    titleKey: "products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    titleKey: "categories",
    href: "/dashboard/categories",
    icon: Layers,
  },
  {
    titleKey: "subcategories",
    href: "/dashboard/subcategories",
    icon: Tag,
  },
  {
    titleKey: "brands",
    href: "/dashboard/brands",
    icon: Award,
  },
  {
    titleKey: "sections",
    href: "/dashboard/sections",
    icon: LayoutGrid,
  },
  {
    titleKey: "advertisements",
    href: "/dashboard/ads",
    icon: Megaphone,
  },
  {
    titleKey: "orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
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
