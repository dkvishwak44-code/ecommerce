"use client";

import { useState } from "react";
import { columns } from "../components/columns";
import ProductsToolbar from "../components/toolbar";
import ProductDialog from "../components/add-product-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductHeader from "../components/product-header";
import RefreshButton from "@/components/ui/refresh-button";
import ProductList from "../components/product-list";
import { useProducts } from "../hook/useProducts";


// const data = [
  //   { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  //   { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  //   { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  //   { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  //   { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  //   { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  //   { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  //   { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  //   { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  //   { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  //   { id: 1, name: "iPhone 15", price: 999, stock: 10, status: "active" },
  //   { id: 2, name: "Shoes", price: 120, stock: 0, status: "out" },
  // ];
  
  export default function ProductsContainer() {
    const [open, setOpen] = useState(false);
    
    const { data = [], isLoading } = useProducts({ page: 1, limit: 10, status: "active" });
    console.log("items ",data)
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
          isLoading={isLoading}
          renderToolbar={(table) => (
            <ProductsToolbar table={table} onAdd={() => setOpen(true)} />
          )}
        />
      </div>
    </div>
  );
}
