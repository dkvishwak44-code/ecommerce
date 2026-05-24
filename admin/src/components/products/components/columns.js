import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ProductActions from "./product-actions";
import { Badge } from "@/components/ui/badge";

export const columns = [
   {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Product",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
         <Badge
              variant={
                status === "active"
                  ? "success"
                  : "fail"
              }
            >
              {status}
            </Badge>
      );
    },
  },
 
];