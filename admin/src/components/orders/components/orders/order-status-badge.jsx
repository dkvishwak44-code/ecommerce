import { Badge } from "@/components/ui/badge";

export function OrderStatusBadge({ status }) {
  return (
    <Badge
      variant={
        status === "delivered"
          ? "success"
          : status === "cancelled"
          ? "warning"
          : "fail"
      }
      className="capitalize"
    >
      {status}
    </Badge>
  );
}