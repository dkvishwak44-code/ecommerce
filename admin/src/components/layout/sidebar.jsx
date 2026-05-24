"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Can from "@/components/rbac/Can";

const menu = [
  {
    name: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "orders",
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    anyOf: ["order.view_own", "order.view_all"],
  },
  {
    name: "products",
    label: "Products",
    href: "/products",
    icon: Package,
    permission: "product.view",
  },
  {
    name: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    permission: "analytics.view",
  },

  {
    name: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      // { name: "profile", label: "Profile", href: "/settings/profile", icon: User },
      // {
      //   name: "account",
      //   label: "Account",
      //   href: "/settings/account",
      //   icon: CreditCard,
      // },
      {
        name: "store",
        label: "Store",
        href: "/settings/store",
        icon: Settings,
      },
      {
        name: "security",
        label: "Security",
        href: "/settings/security",
        icon: ShieldCheck,
      },
      {
        name: "users",
        label: "Users",
        href: "/settings/users",
        icon: Users,
        permission: "user.view",
      },
      {
        name: "roles",
        label: "Roles",
        href: "/settings/roles",
        icon: ShieldCheck,
        permission: "role.view",
      },
    ],
  },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <aside className="w-60 h-screen sticky top-0 flex flex-col bg-blue-600 text-white border-r">
      {/* LOGO */}
      <div className="h-14 flex items-center px-4 border-b border-blue-500/30">
        <h1 className="text-lg font-bold">MyAdmin</h1>
      </div>

      {/* MAIN MENU */}
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenu === item.name;

          // 👉 SUB MENU
          if (item.children) {
            return (
              <Can
                key={item.name}
                permission={item.permission}
                anyOf={item.anyOf}
              >
                <div>
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.name)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-blue-100 hover:bg-blue-500/40"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>

                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon;
                        const active = pathname === sub.href;

                        return (
                          <Can
                            key={sub.href}
                            permission={sub.permission}
                            anyOf={sub.anyOf}
                          >
                            <Link
                              href={sub.href}
                              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                                active
                                  ? "bg-white text-blue-600"
                                  : "text-blue-200 hover:bg-blue-500/40"
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{sub.label}</span>
                            </Link>
                          </Can>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Can>
            );
          }

          // 👉 NORMAL MENU
          const active =
            pathname.split("/").slice(0, 2).join("/") === item.href;

          return (
            <Can
              key={item.href}
              permission={item.permission}
              anyOf={item.anyOf}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  active
                    ? "bg-white text-blue-600"
                    : "text-blue-100 hover:bg-blue-500/40"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </Can>
          );
        })}
      </nav>

      {/* ACCOUNT SECTION */}
      <div className="p-3 border-t border-blue-500/20">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-blue-500/20"
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
              </div>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border bg-background p-2 space-y-1"
          >
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="flex gap-2">
                <User className="w-4 h-4" />
                My Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </DropdownMenuItem>

            <DropdownMenuItem className="flex gap-2">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem> */}

            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
