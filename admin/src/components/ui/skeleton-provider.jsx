// components/SkeletonProvider.js
"use client";

import React from "react";

export function SkeletonProvider({ isLoading, skeleton, children }) {
  // If loading is true, we show the skeleton placeholder
  if (isLoading) {
    return <>{skeleton}</>;
  }

  // Once loading is false, we swap it for the real content
  return <>{children}</>;
}
