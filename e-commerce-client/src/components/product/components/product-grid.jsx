// components/products/ProductGrid.jsx

import ProductCard from "./product-card";

// import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}
