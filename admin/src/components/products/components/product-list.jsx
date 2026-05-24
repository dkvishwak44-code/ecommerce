import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import RefreshButton from "@/components/ui/refresh-button";
import React from "react";

function ProductList({ columns, data,renderToolbar }) {

  return (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        Products
        <RefreshButton />
      </CardTitle>
    </CardHeader>
    <CardContent>
    <DataTable columns={columns} data={data} toolbar={renderToolbar} />

      {/* <ProductDialog open={open} setOpen={setOpen} /> */}
    </CardContent>
  </Card>
  );
}

export default ProductList;
