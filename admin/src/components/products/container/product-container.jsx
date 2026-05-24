"use client";

import { useState } from "react";
import { columns } from "../components/columns";
import ProductsToolbar from "../components/toolbar";
import ProductDialog from "../components/add-product-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductHeader from "../components/product-header";
import RefreshButton from "@/components/ui/refresh-button";
import ProductList from "../components/product-list";

const data = [
  { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
];

export default function ProductsContainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2 rounded">
      <div>
        {" "}
        <ProductHeader />
      </div>

      <div>
        <ProductList
          columns={columns}
          data={data}
          renderToolbar={(table) => (
            <ProductsToolbar table={table} onAdd={() => setOpen(true)} />
          )}
        />
      </div>
    </div>
  );
}
