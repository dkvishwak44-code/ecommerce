import CartCoupon from "./cart-coupons";
import CartItem from "./cart-item";
import { ShoppingBag } from "lucide-react";

export default function CartItems({ items }) {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground sm:text-base">
              Your Cart
            </h2>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Desktop column labels */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="text-center">Price</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
        </div>
      </div>

      {/* ── ITEMS ──────────────────────────────────────────── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-foreground">
            Your cart is empty
          </p>
          <p className="text-sm text-muted-foreground">
            Add some items to get started
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border px-4 sm:px-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CartItem item={item} />
            </div>
          ))}
        </div>
      )}

      {/* ── COUPON ─────────────────────────────────────────── */}
      <div className="border-t border-border bg-muted/30 px-4 py-5 sm:px-6">
        <CartCoupon />
      </div>
    </div>
  );
}