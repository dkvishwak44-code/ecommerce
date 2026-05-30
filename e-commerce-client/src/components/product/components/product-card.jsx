// components/product/ProductCard.jsx
"use client";
import { Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleProductDetails = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <div
      className="overflow-hidden  border border-gray-200  dark:border-gray-800
                dark:bg-gray-900"
      onClick={() => handleProductDetails(product.id)}
    >
      {/* IMAGE */}
      <div className="relative  mt-6">
        <img
          src={product.image}
          alt={product.title}
          className="h-50 w-full object-cover"
        />

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 rounded-full"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="mb-1 text-normal font-semibold">{product.title}</h3>

        <p className="mb-1 text-gray-500">{product.category}</p>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">₹{product.price}</p>

          <Button size="icon">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
