import Link from "next/link";
import { Button } from "@/components/ui/button";
import OrderSummary from "./order-summary";
import OrderCustomer from "./customer-info";
import OrderItems from "./order-items";
import OrderTimeline from "./order-timeline";
import OrderInfo from "./order-info";
import AutoBreadcrumb from "@/components/layout/auto-breadcrumb";
import PaymentHistory from "./payment-history";

export default function OrderDetails() {
  const order = {
    id: "ORD-1024",
    status: "out_for_delivery",
    date: "2026-04-25",
    paymentStatus: "paid",
    paymentMethod: "UPI",

    customer: {
      name: "Dinesh Vishwakarma",
      email: "dinesh@email.com",
      phone: "9876543210",
    },

    shippingAddress: {
      address: "Flat 204, Shanti Apartments",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },

    items: [
      {
        id: 1,
        name: "iPhone 15 Pro",
        sku: "IP15PRO-128",
        qty: 1,
        price: 999,
        discount: 50,
        image: "https://via.placeholder.com/50",
      },
      {
        id: 2,
        name: "AirPods Pro",
        sku: "AIRPODS-PRO",
        qty: 1,
        price: 300,
        discount: 20,
        image: "https://via.placeholder.com/50",
      },
    ],

    summary: {
      subtotal: 1299,
      discount: 70,
      shipping: 50,
      tax: 100,
      total: 1379,
    },

    timeline: [
      {
        status: "order_placed",
        label: "Order Placed",
        date: "2026-04-25 10:00 AM",
        completed: true,
      },
      {
        status: "confirmed",
        label: "Order Confirmed",
        date: "2026-04-25 12:00 PM",
        completed: true,
      },
      {
        status: "shipped",
        label: "Shipped",
        date: "2026-04-26 09:00 AM",
        completed: true,
      },
      {
        status: "out_for_delivery",
        label: "Out for Delivery",
        date: "2026-04-26 01:00 PM",
        completed: true,
      },
      {
        status: "delivered",
        label: "Delivered",
        date: null,
        completed: false,
      },
    ],
  };

  return (
    <div className="space-y-2 p-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h1 className=" flex w-full justify-between items-center text-lg sm:text-xl font-semibold">
          <AutoBreadcrumb />
          {/* Order #{order.id} */}
          <Link href={`/orders/${order.id}/edit`}>
            <Button size="sm" className="w-full sm:w-auto" variant="blue">
              Edit Order
            </Button>
          </Link>
        </h1>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ROW 1 */}
        <div className="h-full">
          <OrderInfo order={order} />
        </div>

        <div className="h-full">
          <OrderCustomer
            customer={order.customer}
            address={order.shippingAddress}
          />
        </div>

        <div className="h-full sm:col-span-2 lg:col-span-1">
          <OrderSummary order={order} />
          {/* <PaymentHistory payments={order.payments} /> */}
        </div>

        {/* ROW 2 */}
        <div className="h-full sm:col-span-2 lg:col-span-2">
          <OrderItems items={order.items} />
        </div>

        <div className="h-full sm:col-span-2 lg:col-span-1">
          <OrderTimeline order={order} />
        </div>
      </div>
    </div>
  );
}
