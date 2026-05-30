"use client";

// components/auth/LoginForm.jsx

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { loginSuccess } from "@/redux/features/auth/authSlice";
import AuthLayout from "./auth-layout";
import SocialLogin from "./ocial-login";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) return;

    const user = {
      email,
      name: email.split("@")[0] || "Customer",
    };
    const token = `local-token-${Date.now()}`;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(loginSuccess({ token, user }));
    const searchParams = new URLSearchParams(window.location.search);
    router.replace(searchParams.get("redirect") || "/profile");
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to continue shopping">
      <SocialLogin />

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-xl border px-4 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-xl border px-4 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* OPTIONS */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember me
          </label>

          <Link href="/forgot-password" className="text-blue-500">
            Forgot Password?
          </Link>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-black font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
        >
          Login
        </button>
      </form>

      {/* REGISTER */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-black dark:text-white"
        >
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
