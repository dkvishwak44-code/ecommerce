"use client";

import { Input } from "@/components/ui/input";
import ProductDialog from "./add-product-dialog";
import { Can } from "@/components/rbac";
import { PERMISSIONS } from "@/lib/permissions";

export default function ProductHeader() {
  return (
    <div className="flex justify-between  gap-3  rounded-xl">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground">
          Manage your products here
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-end gap-2 w-full sm:w-auto">
        
  
        {/* Add Product Dialog Button */}
        <Can permission={PERMISSIONS.PRODUCT_CREATE}>
          <ProductDialog />
        </Can>
      </div>
    </div>
  );
}