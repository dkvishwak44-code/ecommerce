"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersFilters({
  search,
  setSearch,
  status,
  setStatus,
  payment,
  setPayment,
  onReset,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">

      {/*  SEARCH */}
      <Input
        placeholder="Search by customer or order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:max-w-xs"
      />

      {/*  STATUS FILTER */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/*  PAYMENT FILTER */}
      <Select value={payment} onValueChange={setPayment}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Payment Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      {/*  RESET */}
      <Button
        variant="outline"
        onClick={onReset}
        className="w-full sm:w-auto"
      >
        Reset
      </Button>

    </div>
  );
}