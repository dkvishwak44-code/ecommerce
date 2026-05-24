"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")

      return (
    <Badge
      variant={
        status === "Paid"
          ? "success"
          : status === "Pending"
          ? "warning"
          : "destructive"
      }
    >
      {status}
    </Badge>
      )
    },
  },
]

const orders = [
  { id: "#123", customer: "John", total: "₹120", status: "Paid" },
  { id: "#124", customer: "Alice", total: "₹80", status: "Pending" },
   { id: "#123", customer: "John", total: "₹120", status: "Paid" },
  { id: "#124", customer: "Alice", total: "₹80", status: "Pending" },
   { id: "#123", customer: "John", total: "₹120", status: "Paid" },
  { id: "#124", customer: "Alice", total: "₹80", status: "Pending" },
   { id: "#123", customer: "John", total: "₹120", status: "Paid" },
  { id: "#124", customer: "Alice", total: "₹80", status: "Pending" },
   { id: "#123", customer: "John", total: "₹120", status: "Paid" },
  { id: "#124", customer: "Alice", total: "₹80", status: "Pending" },
   { id: "#123", customer: "John", total: "₹120", status: "Paid" },
  { id: "#124", customer: "Alice", total: "₹80", status: "Pending" },
]

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={orders} isLoading={false}/>
      </CardContent>
    </Card>
  )
}