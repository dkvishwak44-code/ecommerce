"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { OrderRowActions } from "./order-row-action";
import { OrderStatusBadge } from "./order-status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export const OrderColumns = (router, setData) => [
  {
    id: "actions",
    header:"Actions",
    cell: ({ row }) => (
      <OrderRowActions row={row.original} router={router} />
    ),
  },

  {
    accessorKey: "id",
    header: "Order ID",
  },

  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => row.original.customer
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.amount}`,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <OrderStatusBadge status={row.original.status} />
    ),
  },

  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => (
      <PaymentStatusBadge status={row.original.payment} />
    ),
  },

  {
    accessorKey: "date",
    header: "Date",
  },

  // UPDATE STATUS COLUMN
  {
    id: "updateStatus",
    header: "Update Status",
    cell: ({ row }) => {
      const order = row.original;

      const handleChange = async (value) => {
        console.log("Update status:", order.id, value);

        //  update UI instantly (optimistic)
        setData((prev) =>
          prev.map((item) =>
            item.id === order.id ? { ...item, status: value } : item
          )
        );

        //  API call (optional)
        // await fetch(`/api/orders/${order.id}`, {
        //   method: "PATCH",
        //   body: JSON.stringify({ status: value }),
        // });
      };

      return (
        <Select value={order.status} onValueChange={handleChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
];