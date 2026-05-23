"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "../ui/button";
// import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

export default function Header() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="h-14 w-full border-b bg-background" />;
  }

  return (
    <header
      className="
        sticky top-0 h-14 w-full flex items-center justify-between
        px-3 sm:px-4
        border-b bg-background shadow
        z-10
      "
    >
      {/*  SEARCH (responsive width) */}
      <div className="w-full sm:w-1/3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="h-9"
        />
      </div>

      {/*  THEME BUTTON */}
      <div className="flex items-center gap-2 ml-3 sm:ml-0 ">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="p-2 rounded-md hover:bg-muted transition">
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className=" z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-gray-900 p-1 shadow-md "
          >
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="cursor-pointer"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="cursor-pointer"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="cursor-pointer"
            >
              <Laptop className="w-4 h-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
