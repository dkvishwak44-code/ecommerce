import Link from "next/link";
import { ArrowLeft, ShoppingBag, ChevronRight, CreditCard, ShieldCheck } from "lucide-react";

export default function CheckoutHeader() {
  const steps = [
    { label: "Cart",     icon: ShoppingBag, href: "/cart",     done: true  },
    { label: "Checkout", icon: CreditCard,  href: "/checkout", done: false },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5">

      {/* ── TOP ROW ────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Left — Icon + Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <Link href="/cart" className="hover:text-foreground transition-colors">
                Cart
              </Link>
              <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="font-medium text-foreground">Checkout</span>
            </div>

            {/* Title */}
            <h1 className="mt-0.5 text-lg font-bold text-foreground leading-tight sm:text-2xl lg:text-3xl">
              Checkout
            </h1>
          </div>
        </div>

        {/* Right — Back button */}
        <Link
          href="/cart"
          className="group inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-white dark:bg-gray-900 px-3 py-2 text-[11px] font-semibold text-muted-foreground shadow-sm transition-all hover:border-foreground hover:text-foreground sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 shrink-0 transition-transform group-hover:-translate-x-0.5 sm:h-3.5 sm:w-3.5" />
          Back to Cart
        </Link>
      </div>

      {/* ── STEP INDICATOR ─────────────────────────────────── */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === steps.length - 1;
          const isActive = !step.done;

          return (
            <div key={step.label} className="flex items-center">
              {/* Step */}
              <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2 ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                <span className="text-[10px] font-semibold sm:text-xs">
                  {step.label}
                </span>
                {step.done && (
                  <span className="text-[10px] text-green-500 sm:text-xs">✓</span>
                )}
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex items-center">
                  <div className="h-px w-6 bg-border sm:w-8" />
                  <ChevronRight className="h-3 w-3 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                  <div className="h-px w-6 bg-border sm:w-8" />
                </div>
              )}
            </div>
          );
        })}

        {/* SSL badge */}
        <div className="ml-auto flex items-center gap-1.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 px-2.5 py-1.5 sm:px-3 sm:py-2">
          <ShieldCheck className="h-3 w-3 shrink-0 text-green-500 sm:h-3.5 sm:w-3.5" />
          <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 sm:text-xs">
            Secure
          </span>
        </div>
      </div>

    </div>
  );
}