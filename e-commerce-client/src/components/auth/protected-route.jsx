"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { loginSuccess } from "@/redux/features/auth/authSlice";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        dispatch(
          loginSuccess({
            token,
            user: JSON.parse(user),
          }),
        );
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      }
      return;
    }

    const redirectTo = encodeURIComponent(pathname || "/");
    router.replace(`/login?redirect=${redirectTo}`);
  }, [dispatch, isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
