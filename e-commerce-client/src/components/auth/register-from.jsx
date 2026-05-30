"use client";

// components/auth/RegisterForm.jsx

import Link from "next/link";
import AuthLayout from "./auth-layout";
import SocialLogin from "./ocial-login";

export default function RegisterForm() {
  return (
    <AuthLayout title="Create Account" subtitle="Join ShopSphere today">
      <SocialLogin />

      <form className="space-y-5">
        {/* NAME */}
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            className="h-12 w-full rounded-xl border px-4 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            className="h-12 w-full rounded-xl border px-4 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <input
            type="password"
            placeholder="Create password"
            className="h-12 w-full rounded-xl border px-4 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm password"
            className="h-12 w-full rounded-xl border px-4 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* TERMS */}
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1" />I agree to the Terms &
          Conditions
        </label>

        {/* BUTTON */}
        <button className="h-12 w-full rounded-xl bg-black font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black">
          Create Account
        </button>
      </form>

      {/* LOGIN */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black dark:text-white">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
