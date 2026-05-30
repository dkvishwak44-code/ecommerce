import {
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function CartFeatures() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc:
        "Free standard shipping",
    },

    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      desc:
        "256-bit SSL protection",
    },

    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc:
        "30 days return policy",
    },
  ];

  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="space-y-6">
        {features.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}