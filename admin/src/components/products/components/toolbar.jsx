import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductsToolbar({ table, onAdd }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">

      {/*  Search */}
      <Input
        placeholder="Search products..."
        value={table.getColumn("name")?.getFilterValue() ?? ""}
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(e.target.value)
        }
        className="max-w-sm"
      />

      {/*  Add Product */}
      <Button onClick={onAdd}>
        Add Product
      </Button>

    </div>
  );
}