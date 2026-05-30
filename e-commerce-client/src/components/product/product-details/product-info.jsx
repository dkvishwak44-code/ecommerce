"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import QuantitySelector from "./quantity-selector";

// import QuantitySelector from "./QuantitySelector";

export default function ProductInfo({ product }) {
  return (
    <div>
      {/* CATEGORY */}
      <span className="rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
        New Arrival
      </span>

      {/* TITLE */}
      <h1 className="mt-5 text-4xl font-bold">{product.title}</h1>

      {/* RATING */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="fill-yellow-500" size={18} />
          <Star className="fill-yellow-500" size={18} />
          <Star className="fill-yellow-500" size={18} />
          <Star className="fill-yellow-500" size={18} />
        </div>

        <span className="text-sm text-muted-foreground">
          ({product.rating?.count} Reviews)
        </span>
      </div>

      {/* PRICE */}
      <div className="mt-6 flex items-center gap-4">
        <h2 className="text-4xl font-bold">₹{product.price}</h2>

        <span className="text-xl text-muted-foreground line-through">
          ₹4999
        </span>

        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-500">
          30% OFF
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-6 leading-7 text-muted-foreground">
        {product.description}
      </p>

      {/* COLORS */}
      <div className="mt-8">
        <h3 className="mb-4 font-semibold">Colors</h3>

        <div className="flex gap-3">
          <button className="h-10 w-10 rounded-full bg-black ring-2 ring-black ring-offset-2" />

          <button className="h-10 w-10 rounded-full bg-red-500" />

          <button className="h-10 w-10 rounded-full bg-blue-500" />
        </div>
      </div>

      {/* SIZES */}
      <div className="mt-8">
        <h3 className="mb-4 font-semibold">Sizes</h3>

        <div className="flex flex-wrap gap-3">
          {[39, 40, 41, 42, 43, 44].map((size) => (
            <button
              key={size}
              className="flex h-12 w-12 items-center justify-center rounded-xl border transition hover:bg-black hover:text-white"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <QuantitySelector />

        <button className="flex h-14 items-center gap-3 rounded-xl bg-black px-8 text-white transition hover:opacity-90">
          <ShoppingCart size={20} />
          Add To Cart
        </button>

        <button className="flex h-14 w-14 items-center justify-center rounded-xl border transition hover:bg-black hover:text-white">
          <Heart size={20} />
        </button>
      </div>

      {/* FEATURES */}
      <div className="mt-10 grid grid-cols-2 gap-5 border-t pt-8">
        <div>
          <h4 className="font-semibold">Free Delivery</h4>

          <p className="mt-1 text-sm text-muted-foreground">
            On orders above ₹499
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Secure Payment</h4>

          <p className="mt-1 text-sm text-muted-foreground">
            100% secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}
