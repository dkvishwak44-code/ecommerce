"use client";

import { Minus, Plus, Heart, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CartItem({ item }) {
  const [quantity, setQuantity] = useState(item.quantity ?? 1);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  const total = (item.price * quantity).toFixed(2);

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-border  dark:bg-gray-900 p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:p-5">

      {/* ── IMAGE ─────────────────────────────────────────── */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-gray-50 dark:bg-gray-800 sm:h-28 sm:w-28">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.badge && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </div>

      {/* ── DETAILS ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 min-w-0">

        {/* Title + Total (top row) */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                {item.description}
              </p>
            )}
          </div>

          {/* Total — visible on all sizes */}
          <div className="shrink-0 text-right">
            <p className="text-base font-bold text-foreground sm:text-lg">
              ${total}
            </p>
            <p className="text-xs text-muted-foreground">
              ${item.price} each
            </p>
          </div>
        </div>

        {/* Variants */}
        <div className="flex flex-wrap gap-2">
          {item.color && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border  px-2.5 py-1 text-xs text-muted-foreground">
              <span
                className="h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: item.color }}
              />
              {item.color}
            </span>
          )}
          {item.size && (
            <span className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs text-muted-foreground">
              Size: {item.size}
            </span>
          )}
        </div>

        {/* Bottom row — Quantity + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Quantity stepper */}
          <div className="flex items-center gap-1 rounded-xl border border-border p-1">
            <button
              onClick={decrease}
              disabled={quantity <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white hover:text-foreground dark:hover:bg-gray-700 disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="w-7 text-center text-sm font-semibold tabular-nums text-foreground">
              {quantity}
            </span>

            <button
              onClick={increase}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white hover:text-foreground dark:hover:bg-gray-700"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-pink-50 hover:text-pink-500 dark:hover:bg-pink-950">
              <Heart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Wishlist</span>
            </button>

            <div className="h-3.5 w-px bg-border" />

            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950">
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}