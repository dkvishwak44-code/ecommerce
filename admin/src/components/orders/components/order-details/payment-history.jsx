import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentHistory({ payments = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">

        {payments.length === 0 && (
          <p className="text-muted-foreground text-center">
            No payment records found
          </p>
        )}

        {payments.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between border rounded-md p-3"
          >
            {/* LEFT */}
            <div>
              <p className="font-medium">
                ₹{p.amount} • {p.method}
              </p>
              <p className="text-xs text-muted-foreground">
                {p.date}
              </p>
            </div>

            {/* RIGHT STATUS */}
            <span
              className={`px-2 py-1 text-xs rounded ${
                p.status === "success"
                  ? "bg-green-100 text-green-700"
                  : p.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {p.status}
            </span>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}