import { Button } from "@/components/ui/button";
import { ArrowBigDown } from "lucide-react";


export default function OrderHeader() {
  return (
    <div className="flex justify-between  gap-3  rounded-xl">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage your products here
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-end gap-2 w-full sm:w-auto">
        
  
        {/* Add Product Dialog Button */}
       <Button variant="blue">
        <span className="flex gap-1"> <ArrowBigDown/>  Export</span> 
       </Button>

      </div>
    </div>
  );
}