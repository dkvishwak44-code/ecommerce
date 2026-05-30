import Image from "next/image";

export default function OrderItems({
  items,
}) {
  return (
    <div className="mt-8 space-y-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-4"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border bg-white">
            <img
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="font-semibold">
              $
              {(
                item.price *
                item.quantity
              ).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}