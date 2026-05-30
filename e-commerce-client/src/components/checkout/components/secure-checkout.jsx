import {
  ShieldCheck,
  Lock,
  Truck,
} from "lucide-react";

export default function SecureCheckout() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
    },

    {
      icon: Lock,
      title: "SSL Protected",
    },

    {
      icon: Truck,
      title: "Fast Delivery",
    },
  ];

  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="font-medium">
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}