import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderInfo({ order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-medium">{order.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span>{order.date}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              order.status === "processing"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment</span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              order.paymentStatus === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Method</span>
          <span>{order.paymentMethod || "UPI"}</span>
        </div>

        {/* <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{order.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{order.tax}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{order.shipping}</span>
        </div> */}

        {/* <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div> */}
        {/* <div>
            <span>Customer Notes</span>
            <span>Please deliver between 9 A.M - 5 P.M</span>
        </div> */}

      </CardContent>
    </Card>
  );
}