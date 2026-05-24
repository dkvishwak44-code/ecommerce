"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

import Can from "@/components/rbac/Can";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart, anyOf: ["order.view_own", "order.view_all"] },
  { name: "Products", href: "/products", icon: Package, permission: "product.view" },
  { name: "Stats", href: "/analytics", icon: BarChart3, permission: "analytics.view" },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 h-16
        bg-blue-600 dark:bg-blue-950
        border-t border-blue-500/30
        flex justify-around items-center md:hidden
      "
    >
      {menu.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Can key={item.href} permission={item.permission} anyOf={item.anyOf}>
            <Link
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1
                w-full h-full text-xs transition
                ${
                  active
                    ? "text-white"
                    : "text-blue-100 hover:text-white"
                }
              `}
            >
              {/* ICON BACKGROUND */}
              <div
                className={`
                  p-1.5 rounded-md transition
                  ${
                    active
                      ? "bg-white text-blue-600"
                      : "text-blue-100"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className="text-[10px]">{item.name}</span>
            </Link>
          </Can>
        );
      })}
    </nav>
  );
}