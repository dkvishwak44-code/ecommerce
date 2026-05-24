import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrderCustomer({ customer, address }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* TOP: Image + Info */}
        <div className="flex items-center gap-4">
          {/* <Image
            // src="https://via.placeholder.com/60"
            alt="customer"
            width={60}
            height={60}
            className="rounded-full"
          /> */}

          <div className="text-sm ">
            <p className="font-medium">{customer?.name}</p>
            <p className="text-muted-foreground">{customer?.email}</p>
            <p>{customer?.phone}</p>
          </div>
        </div>

        {/* SEPARATOR */}
        <Separator />

        {/* ADDRESS */}
        <div className="text-sm ">
          <p className="text-muted-foreground">
            {address?.address}, {address?.city}
          </p>
          <p className="text-muted-foreground">
            {address?.state} - {address?.pincode}
          </p>
          <p className="text-muted-foreground">{address?.country}</p>
        </div>
      </CardContent>
    </Card>
  );
}
