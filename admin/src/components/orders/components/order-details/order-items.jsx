"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";

export default function OrderItems({ items }) {
  // define columns
  const columns = [
    {
      accessorKey: "name",
      header: "Product",
    },
    {
      accessorKey: "qty",
      header: "Qty",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium">
          ${row.original.price}
        </span>
      ),
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold">
          ₹{row.original.qty * row.original.price}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={items} />
      </CardContent>
    </Card>
  );
}