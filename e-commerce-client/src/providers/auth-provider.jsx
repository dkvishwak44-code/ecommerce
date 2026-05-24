"use client";

import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { loginSuccess } from "@/redux/features/auth/authSlice";

export default function AuthProvider({
  children,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const user =
      localStorage.getItem("user");

    if (token && user) {
      dispatch(
        loginSuccess({
          token,
          user: JSON.parse(user),
        })
      );
    }
  }, [dispatch]);

  return children;
}