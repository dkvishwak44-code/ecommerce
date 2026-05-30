import { useRouter } from "next/navigation";
import CartFeatures from "./cart-features";
import { ArrowRight, Tag, Truck, ShieldCheck, RotateCcw } from "lucide-react";

export default function CartSummary({ items }) {
    const router = useRouter();
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = 65;
  const shipping = 0;
  const total = subtotal - discount + shipping;
  const savings = discount;

  return (
    <div className="space-y-4">

      {/* ── MAIN SUMMARY CARD ──────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden sm:rounded-3xl">

        {/* Card header */}
        <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background sm:h-9 sm:w-9">
            <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <h2 className="text-sm font-bold text-foreground sm:text-base lg:text-lg">
            Order Summary
          </h2>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">

          {/* Line items */}
          <div className="space-y-3.5">

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground sm:text-sm">
                Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Shipping
                </span>
              </div>
              <span className="text-xs font-semibold text-green-500 sm:text-sm">
                FREE
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Discount
                </span>
              </div>
              <span className="text-xs font-semibold text-green-500 sm:text-sm">
                -${discount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Savings pill */}
          {savings > 0 && (
            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 px-3 py-2">
              <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 sm:text-xs">
                🎉 You're saving ${savings.toFixed(2)} on this order!
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground sm:text-base lg:text-lg">
              Total
            </span>
            <div className="text-right">
              <span className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                ${total.toFixed(2)}
              </span>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                Incl. taxes & fees
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button onClick={()=>router.push("/checkout")} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:rounded-2xl sm:py-3.5 sm:text-sm lg:text-base">
            Proceed to Checkout
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </button>
          
          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-2 pt-1">
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
        </div>
      </div>

      {/* ── CART FEATURES ──────────────────────────────────── */}
      <CartFeatures />
    </div>
  );
}