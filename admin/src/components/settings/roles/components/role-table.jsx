"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/ui/data-table";

import { RolesColumns } from "./role-columns";

const rolesData = [
  {
    id: 1,
    name: "Super Admin",
    slug: "super-admin",
    description: "Full system access",
    users: 1,
    permissions: ["*"],
    status: "active",
    createdAt: "May 10, 2026",
  },

  {
    id: 2,
    name: "Admin",
    slug: "admin",
    description: "Manage products, orders and users",
    users: 3,
    permissions: [
      "product.read",
      "product.write",
      "order.read",
    ],
    status: "active",
    createdAt: "May 11, 2026",
  },

  {
    id: 3,
    name: "Seller",
    slug: "seller",
    description: "Manage own products and orders",
    users: 8,
    permissions: [
      "product.read",
      "product.write",
    ],
    status: "active",
    createdAt: "May 12, 2026",
  },

  {
    id: 4,
    name: "Staff",
    slug: "staff",
    description: "Order management only",
    users: 12,
    permissions: [
      "order.read",
    ],
    status: "inactive",
    createdAt: "May 13, 2026",
  },
];

export default function RolesTable() {
  const data = useMemo(() => rolesData, []);

  return (
    <div className="space-y-5 bg-card">
      

      {/* CUSTOM TABLE */}
      <DataTable
        columns={RolesColumns}
        data={data}
      />
    </div>
  );
}