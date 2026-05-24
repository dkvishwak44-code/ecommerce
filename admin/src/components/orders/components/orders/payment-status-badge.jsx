import { Badge } from "@/components/ui/badge";

export function PaymentStatusBadge({ status }) {
  return (
    <Badge
      variant={
        status === "paid"
          ? "success"
          : status === "refunded"
          ? "destructive"
          : "fail"
      }
      className="capitalize"
    >
      {status}
    </Badge>
  );
}