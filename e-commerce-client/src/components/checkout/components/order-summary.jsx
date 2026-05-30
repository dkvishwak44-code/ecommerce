import CouponBox from "./coupon-box";
import OrderItems from "./order-items";
import { ShoppingBag, Truck, Tag, ArrowRight, ShieldCheck, RotateCcw } from "lucide-react";

export default function OrderSummary({ items }) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = 20;
  const discount = 0; // update when coupon applied
  const total = subtotal + shipping - discount;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background sm:h-9 sm:w-9">
          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground sm:text-base lg:text-lg">
            Order Summary
          </h2>
          <p className="text-[10px] text-muted-foreground sm:text-xs">
            {items.length} {items.length === 1 ? "item" : "items"} in your order
          </p>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">

        {/* ── ORDER ITEMS ────────────────────────────────────── */}
        <OrderItems items={items} />

        {/* ── COUPON ─────────────────────────────────────────── */}
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 sm:rounded-2xl sm:p-4">
          <CouponBox />
        </div>

        {/* ── PRICE BREAKDOWN ────────────────────────────────── */}
        <div className="space-y-3">

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Subtotal ({items.length} items)
            </span>
            <span className="text-xs font-semibold text-foreground sm:text-sm">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Shipping
            </span>
            <span className="text-xs font-semibold text-foreground sm:text-sm">
              ${shipping.toFixed(2)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-green-600 sm:text-sm">
                <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Discount
              </span>
              <span className="text-xs font-semibold text-green-500 sm:text-sm">
                -${discount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Total */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-foreground sm:text-base lg:text-lg">
              Total
            </span>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                ${total.toFixed(2)}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                Incl. taxes & fees
              </p>
            </div>
          </div>
        </div>

        {/* ── CTA BUTTON ─────────────────────────────────────── */}
        <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:rounded-2xl sm:py-3.5 sm:text-sm lg:text-base">
          Place Order
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </button>

        {/* ── TRUST BADGES ───────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: ShieldCheck, label: "Secure Checkout" },
            { icon: RotateCcw,   label: "Easy Returns"   },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-muted/60 px-2 py-2"
            >
              <Icon className="h-3 w-3 shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── SSL NOTE ───────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-green-500 sm:h-3.5 sm:w-3.5" />
          <p className="text-[10px] text-muted-foreground sm:text-xs">
            256-bit SSL encrypted & secure checkout
          </p>
        </div>

      </div>
    </div>
  );
}