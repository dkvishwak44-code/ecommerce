"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LayoutWrapper from "./layout";

export default function AppGuard({ children }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, mounted, router]);

  // Don't render the protected layout if not logged in
  if (!mounted || !isLoggedIn) {
    return null;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
}