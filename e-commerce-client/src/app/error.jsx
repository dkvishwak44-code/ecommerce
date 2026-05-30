"use client";

import { useEffect } from "react";

import Link from "next/link";

import {
  AlertTriangle,
  RefreshCcw,
  Home,
} from "lucide-react";

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Oops! Something went wrong
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          We encountered an unexpected error.
          Please try again or return home.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white"
          >
            <RefreshCcw size={18} />
            Retry
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border px-5 py-3"
          >
            <Home size={18} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}