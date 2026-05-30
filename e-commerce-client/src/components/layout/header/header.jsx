"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  Menu,
  Package,
  HelpCircle,
  MapPin,
  Globe,
  Truck,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

// ─── Top Bar ────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="bg-gray-950 dark:bg-gray-900 text-white text-[11px] py-2 px-4 border-b border-gray-800">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Truck size={12} />
          <span>Free Shipping on orders above $50</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-gray-400">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <HelpCircle size={12} />
            Help &amp; Support
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <MapPin size={12} />
            Track Order
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                $ USD <ChevronDown size={10} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[100px] bg-popover">
              <DropdownMenuItem>$ USD</DropdownMenuItem>
              <DropdownMenuItem>€ EUR</DropdownMenuItem>
              <DropdownMenuItem>£ GBP</DropdownMenuItem>
              <DropdownMenuItem>₹ INR</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <Globe size={12} />
                EN <ChevronDown size={10} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[100px] bg-popover">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
              <DropdownMenuItem>Deutsch</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 hover:bg-accent rounded-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun
        size={18}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={18}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────

function MainHeader() {
    const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="bg-background border-b border-border py-3.5 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-[22px] font-black tracking-tight text-foreground">
            Shop<span className="text-primary">Sphere</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div
          className={`flex-1 max-w-[560px] relative transition-all duration-200 ${
            searchFocused ? "ring-2 ring-foreground rounded-lg" : ""
          }`}
        >
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted hover:border-muted-foreground/30 transition-colors">
            <Input
              placeholder="Search for products, brands and more..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-10 pl-4 pr-2 placeholder:text-muted-foreground text-foreground"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
            <button className="bg-foreground hover:opacity-80 text-background px-4 h-10 flex items-center justify-center transition-all">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-10 px-3 hover:bg-accent rounded-lg"
              >
                <User size={18} strokeWidth={1.5} className="text-foreground" />
                <div className="hidden lg:flex flex-col items-start text-left leading-none">
                  <span className="text-[10px] text-muted-foreground">
                    Account
                  </span>
                  <span className="text-[12px] font-semibold text-foreground">
                    Sign In
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-popover">
              <DropdownMenuItem onClick={() => router.push("/login")}>
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/register")}>
                Register
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/orders")}>
                My Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                My Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wishlist */}
          <Button
            variant="ghost"
            className="relative h-10 px-3 hover:bg-accent rounded-lg flex items-center gap-2"
          >
            <div className="relative">
              <Heart size={18} strokeWidth={1.5} className="text-foreground" />
              <Badge className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[9px] bg-amber-500 hover:bg-amber-500 text-white rounded-full flex items-center justify-center font-bold border-0">
                2
              </Badge>
            </div>
            <span className="hidden lg:block text-[12px] font-semibold text-foreground">
              Wishlist
            </span>
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            className="relative h-10 px-3 hover:bg-accent rounded-lg flex items-center gap-2"
          >
            <div className="relative">
              <ShoppingCart
                size={18}
                strokeWidth={1.5}
                className="text-foreground"
              />
              <Badge className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[9px] bg-foreground hover:bg-foreground text-background rounded-full flex items-center justify-center font-bold border-0">
                3
              </Badge>
            </div>
            <div className="hidden lg:flex flex-col items-start leading-none">
              <span className="text-[10px] text-muted-foreground">My</span>
              <span className="text-[12px] font-semibold text-foreground">
                Cart
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Category Navbar ──────────────────────────────────────────────────────────

const navItems = [
  { label: "Home", href: "/", active: true },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "Featured", href: "/shop/featured" },
      { label: "Sale Items", href: "/shop/sale" },
    ],
  },
  { label: "Deals", href: "/deals" },
  { label: "New Arrivals", href: "/new-arrivals" },
  {
    label: "Brands",
    href: "/brands",
    children: [
      { label: "All Brands", href: "/brands" },
      { label: "Top Brands", href: "/brands/top" },
      { label: "New Brands", href: "/brands/new" },
    ],
  },
  { label: "Blog", href: "/blog" },
];

const categories = [
  "Fashion",
  "Electronics",
  "Home & Living",
  "Beauty",
  "Footwear",
  "Watches",
  "Bags",
  "Sports",
];

function CategoryNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-border px-4">
      <div className="max-w-[1280px] mx-auto flex items-center">
        {/* All Categories Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-accent transition-colors px-4 py-3 border-r border-border shrink-0">
              <Menu size={16} />
              <span>All Categories</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 bg-popover" align="start">
            {categories.map((cat) => (
              <DropdownMenuItem key={cat} className="cursor-pointer">
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-0">
              {navItems.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger
                      className={`text-sm font-medium px-4 py-3 h-auto rounded-none transition-colors hover:text-foreground hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent ${
                        item.active
                          ? "text-foreground border-b-2 border-foreground"
                          : "text-muted-foreground border-b-2 border-transparent"
                      }`}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="p-2 min-w-[160px] bg-popover">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavigationMenuLink asChild>
                              <a
                                href={child.href}
                                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                              >
                                {child.label}
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild>
                      <a
                        href={item.href}
                        className={`flex items-center text-sm font-medium px-4 py-3 border-b-2 transition-colors hover:text-foreground ${
                          item.active
                            ? "text-foreground border-foreground"
                            : "text-muted-foreground border-transparent hover:border-border"
                        }`}
                      >
                        {item.label}
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto py-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-background">
              {/* ✅ fixed: SheetTitle required by shadcn for accessibility */}
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">
                    Shop<span className="text-primary">Sphere</span>
                  </span>
                  <ThemeToggle />
                </div>
                <div className="flex-1 overflow-y-auto py-3">
                  <p className="px-5 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Navigation
                  </p>
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`flex items-center px-5 py-2.5 text-sm transition-colors hover:bg-accent ${
                        item.active
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="px-5 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Categories
                    </p>
                    {categories.map((cat) => (
                      <a
                        key={cat}
                        href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center px-5 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-border bg-muted space-y-2">
                  <Button className="w-full bg-foreground hover:opacity-80 text-background text-sm h-9">
                    <User size={14} className="mr-2" /> Sign In
                  </Button>
                  <Button variant="outline" className="w-full text-sm h-9">
                    <Package size={14} className="mr-2" /> Track Order
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

// ─── Composed Export ──────────────────────────────────────────────────────────

export default function Header() {
  return (
    <header className="contents">
      <TopBar />
      <MainHeader />
      <CategoryNavbar />
    </header>
  );
}
