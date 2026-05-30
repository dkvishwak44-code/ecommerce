import Link from "next/link";
import { ShoppingCart, ArrowLeft, Home } from "lucide-react";

export default function CartHeader({ itemCount = 0 }) {
  return (
    // <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    //   {/* ── LEFT ───────────────────────────────────────────── */}
    //   <div className="flex items-center gap-4">

    //     {/* Icon */}
    //     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm sm:h-14 sm:w-14">
    //       <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
    //     </div>

    //     <div>
    //       {/* Breadcrumb */}
    //       <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    //         <Home className="h-3 w-3" />
    //         <Link href="/" className="hover:text-foreground transition-colors">
    //           Home
    //         </Link>
    //         <span>/</span>
    //         <span className="text-foreground font-medium">Cart</span>
    //       </div>

    //       {/* Title */}
    //       <div className="mt-0.5 flex items-center gap-3">
    //         <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
    //           Shopping Cart
    //         </h1>
    //         {itemCount > 0 && (
    //           <span className="inline-flex h-6 items-center rounded-full bg-foreground px-2.5 text-xs font-bold text-background">
    //             {itemCount} {itemCount === 1 ? "item" : "items"}
    //           </span>
    //         )}
    //       </div>
    //     </div>
    //   </div>

    //   {/* ── RIGHT ──────────────────────────────────────────── */}
    //   <Link
    //     href="/products"
    //     className="group inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-white dark:bg-gray-900 px-4 py-2.5 text-xs font-semibold text-muted-foreground shadow-sm transition-all hover:border-foreground hover:text-foreground sm:text-sm"
    //   >
    //     <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 sm:h-4 sm:w-4" />
    //     Continue Shopping
    //   </Link>

    // </div>
    <></>
  );
}