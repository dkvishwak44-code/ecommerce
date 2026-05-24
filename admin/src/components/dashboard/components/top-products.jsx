"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  {
    name: "iPhone 15",
    price: "₹999",
    image: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/n/q/h/-original-imahgfmzjj8gtqbc.jpeg?q=70",
  },
  {
    name: "Shoes",
    price: "₹120",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/k/i/l/10-rng-eva-740-wht-blk-10-bruton-white-black-original-imahjn6cmwhphfaw.jpeg?q=70",
  },
  {
    name: "iPhone 15",
    price: "₹999",
    image: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/n/q/h/-original-imahgfmzjj8gtqbc.jpeg?q=70",
  },
  {
    name: "Shoes",
    price: "₹120",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/k/i/l/10-rng-eva-740-wht-blk-10-bruton-white-black-original-imahjn6cmwhphfaw.jpeg?q=70",
  },
  {
    name: "iPhone 15",
    price: "₹999",
    image: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/n/q/h/-original-imahgfmzjj8gtqbc.jpeg?q=70",
  },
  {
    name: "Shoes",
    price: "₹120",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/k/i/l/10-rng-eva-740-wht-blk-10-bruton-white-black-original-imahjn6cmwhphfaw.jpeg?q=70",
  },
  {
    name: "iPhone 15",
    price: "₹999",
    image: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/n/q/h/-original-imahgfmzjj8gtqbc.jpeg?q=70",
  },
  {
    name: "Shoes",
    price: "₹120",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/k/i/l/10-rng-eva-740-wht-blk-10-bruton-white-black-original-imahjn6cmwhphfaw.jpeg?q=70",
  },
];

export default function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 overflow-y-auto h-73">
        {products.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4"
          >
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <Image
                src={p?.image}
                alt={p?.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />

              <span className="font-medium">{p.name}</span>
            </div>

            {/* Right Side */}
            <span className="text-muted-foreground font-medium">
              {p.price}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}