"use client";

import { useState } from "react";

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex h-14 items-center rounded-xl border">
      <button
        onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
        className="px-5 text-xl"
      >
        -
      </button>

      <span className="w-10 text-center">{quantity}</span>

      <button
        onClick={() => setQuantity((prev) => prev + 1)}
        className="px-5 text-xl"
      >
        +
      </button>
    </div>
  );
}
