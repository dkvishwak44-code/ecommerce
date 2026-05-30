import { Ticket } from "lucide-react";

export default function CartCoupon() {
  return (
    <div className="mt-8 flex flex-col gap-5 rounded-2xl border bg-muted/40 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white">
          <Ticket className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-semibold">
            Get 10% off your first
            order!
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Apply code WELCOME10
          </p>
        </div>
      </div>

      <button className="h-12 rounded-xl border px-6 font-medium">
        Apply Coupon
      </button>
    </div>
  );
}