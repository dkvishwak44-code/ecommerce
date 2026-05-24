"use client"

import { useIsMobile } from "@/hooks/use-is-mobile";
import Header from "./header";
import Sidebar from "./sidebar";
import BottomNav from "./bottom-nav";

export default function LayoutWrapper({ children }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar (Desktop only) */}
      {!isMobile && <Sidebar />}

      {/* Main Area */}
      <div className="flex flex-col flex-1">

        <Header />

        <main className="flex-1 p-4">
          {children}
        </main>

        {/* Bottom Nav (Mobile only, at PAGE bottom) */}
        {isMobile && <BottomNav />}

      </div>
    </div>
  );
}