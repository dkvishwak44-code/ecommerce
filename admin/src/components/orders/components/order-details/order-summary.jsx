import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrderSummary({ order }) {
  const summary = order?.summary;

  // summary: {
  //     subtotal: 1299,
  //     discount: 70,
  //     shipping: 50,
  //     tax: 100,
  //     total: 1379,
  //   },
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {/* <p><b>Status:</b> {order.status}</p>
        <p><b>Date:</b> {order.date}</p>
        <p><b>Total:</b> ${order.total}</p> */}
        <div className="flex justify-between items-center">
          <p>Subtotal</p>
          <p>{summary?.subtotal}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Shipping</p>
          <p>{summary?.shipping}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Tax</p>
          <p>{summary?.tax}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Discount</p>
          <p>{summary?.discount}</p>
        </div>
        <Separator />
        <div className="flex justify-between items-center mt-5">
          <b>Total</b>
          <b>{summary?.total}</b>
        </div>
      </CardContent>
    </Card>
  );
}
