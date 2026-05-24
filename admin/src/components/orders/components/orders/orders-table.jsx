"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { OrderColumns } from "./order-columns";
import OrdersFilters from "./order-filter";
import { DataTable } from "@/components/ui/data-table";

export default function OrdersTable({ orders = [] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [data, setData] = useState(orders);

  //  Safe filter
  const filtered = useMemo(() => {
    return data.filter((o) => {
      const searchText = search.toLowerCase();

      const matchSearch =
        o?.customer?.name?.toLowerCase().includes(searchText) ||
        o?.id?.toLowerCase().includes(searchText);

      const matchStatus =
        status === "all" || o.status === status;

      const matchPayment =
        payment === "all" || o.payment === payment;

      return matchSearch && matchStatus && matchPayment;
    });
  }, [data, search, status, payment]);

  return (
    <div className="p-6 space-y-4">

      {/*  FIX: pass props */}
      <OrdersFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        payment={payment}
        setPayment={setPayment}
        onReset={() => {
          setSearch("");
          setStatus("all");
          setPayment("all");
        }}
      />

      {/*  Table */}
      <DataTable
        columns={OrderColumns(router, setData)}
        data={filtered}
      />

    </div>
  );
}