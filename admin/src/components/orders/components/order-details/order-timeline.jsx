import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function OrderTimeline({ order }) {
  const steps = [
    { key: "placed", label: "Order Placed" },
    { key: "payment", label: "Payment Confirmed" },
    { key: "processed", label: "Order Processed" },
    { key: "shipped", label: "Order Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.key === order.timeline?.find((t) => t.status === step.key)?.status
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="pl-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.key} className="relative flex gap-3 pb-6">

                {/* LINE (each step controls its own line) */}
                {!isLast && (
                  <div
                    className={`absolute left-[9px] top-5 w-[2px] h-full
                    ${index < currentStepIndex ? "bg-green-500" : "bg-muted"}`}
                  />
                )}

                {/* DOT */}
                <div
                  className={`z-10 flex items-center justify-center w-5 h-5 rounded-full border
                  ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-600  border-blue-500"
                      : "bg-muted border-muted"
                  }`}
                >
                  {isCompleted && <Check size={12} />}
                </div>

                {/* CONTENT */}
                <div className="text-sm">
                  <p
                    className={`font-medium ${
                      isCurrent ? "text-blue-600" : ""
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="text-muted-foreground text-xs">
                    {order.timeline?.[index]?.date || "Pending"}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}