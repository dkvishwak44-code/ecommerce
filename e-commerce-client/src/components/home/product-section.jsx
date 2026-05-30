// components/home/ProductSection.jsx

import ProductCard from "../product/components/product-card";

import shoes from "../../../public/shoes.png";

// import ProductCard from "../product/ProductCard";

const products = [
  {
    id: 1,
    title: "Modern Sneakers",
    category: "Shoes",
    price: 2499,
    image: { ...shoes },
  },
  {
    id: 2,
    title: "Premium Hoodie",
    category: "Fashion",
    price: 1999,
    image: "/products/hoodie.jpg",
  },
  {
    id: 3,
    title: "Smart Watch",
    category: "Electronics",
    price: 4999,
    image: "/products/watch.jpg",
  },
  {
    id: 3,
    title: "Smart Watch",
    category: "Electronics",
    price: 4999,
    image: "/products/watch.jpg",
  },
];

export default function ProductSection() {
  return (
    <section className=" bg-background max-h-100">
      <div className="">
        <h2 className="mb-10 text-3xl font-bold">Trending Products</h2>

        <div className="grid gap-6 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
