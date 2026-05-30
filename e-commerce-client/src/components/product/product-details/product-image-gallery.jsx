"use client";

import Image from "next/image";

import { useState } from "react";

export default function ProductImageGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.image);

  return (
    <div className="flex gap-4">
      {/* MAIN IMAGE */}
      <div className="flex-1 overflow-hidden rounded-3xl border p-10">
        <Image
          src={selectedImage}
          alt={product.title}
          width={700}
          height={500}
          className="mx-auto h-[300px] w-full object-contain"
        />
        {/* THUMBNAILS */}
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4].map((item) => (
            <button
              key={item}
              onClick={() => setSelectedImage(product.image)}
              className="overflow-hidden rounded-xl border w-full "
            >
              <Image
                src={product.image}
                alt={product.title}
                width={90}
                height={90}
                className="h-[100px] w-full object-contain "
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
