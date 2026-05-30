// components/products/ProductsLayout.jsx

"use client";

import { useEffect, useMemo, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductFilters from "../components/product-filters";
import ProductGrid from "../components/product-grid";
import ProductSort from "../components/product-sort";

export default function ProductContainer() {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  // PRODUCTS
  //   const products = [
  //     {
  //       id: 1,
  //       title: "Modern Sneakers",
  //       category: "Shoes",
  //       brand: "Nike",
  //       price: 2499,
  //       image: "/products/shoes.png",
  //     },

  //     {
  //       id: 2,
  //       title: "Premium Hoodie",
  //       category: "Fashion",
  //       brand: "Zara",
  //       price: 1999,
  //       image: "/products/hoodie.jpg",
  //     },

  //     {
  //       id: 3,
  //       title: "Smart Watch",
  //       category: "Electronics",
  //       brand: "Apple",
  //       price: 4999,
  //       image: "/products/watch.jpg",
  //     },

  //     {
  //       id: 4,
  //       title: "Leather Bag",
  //       category: "Accessories",
  //       brand: "Gucci",
  //       price: 2999,
  //       image: "/products/bag.jpg",
  //     },

  //     {
  //       id: 5,
  //       title: "Gaming Headphone",
  //       category: "Electronics",
  //       brand: "Sony",
  //       price: 3999,
  //       image: "/products/headphone.jpg",
  //     },
  //   ];
  const products = [
    {
      id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    {
      id: 2,
      title: "Mens Casual Premium Slim Fit T-Shirts ",
      price: 22.3,
      description:
        "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
      category: "men's clothing",
      image:
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      rating: {
        rate: 4.1,
        count: 259,
      },
    },
    {
      id: 3,
      title: "Mens Cotton Jacket",
      price: 55.99,
      description:
        "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
      rating: {
        rate: 4.7,
        count: 500,
      },
    },
    {
      id: 4,
      title: "Mens Casual Slim Fit",
      price: 15.99,
      description:
        "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
      rating: {
        rate: 2.1,
        count: 430,
      },
    },
    {
      id: 5,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    {
      id: 6,
      title: "Mens Casual Premium Slim Fit T-Shirts ",
      price: 22.3,
      description:
        "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
      category: "men's clothing",
      image:
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      rating: {
        rate: 4.1,
        count: 259,
      },
    },
    {
      id: 7,
      title: "Mens Cotton Jacket",
      price: 55.99,
      description:
        "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
      rating: {
        rate: 4.7,
        count: 500,
      },
    },
    {
      id: 8,
      title: "Mens Casual Slim Fit",
      price: 15.99,
      description:
        "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
      rating: {
        rate: 2.1,
        count: 430,
      },
    },
  ];

  // INITIAL FILTERS FROM URL
  const [filters, setFilters] = useState({
    categories:
      searchParams.get("categories")?.split(",").filter(Boolean) || [],

    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],

    price: Number(searchParams.get("price")) || 10000,

    search: searchParams.get("search") || "",
  });

  // UPDATE URL WHEN FILTER CHANGES
  useEffect(() => {
    const params = new URLSearchParams();

    // CATEGORY
    if (filters.categories.length > 0) {
      params.set("categories", filters.categories.join(","));
    }

    // BRANDS
    if (filters.brands.length > 0) {
      params.set("brands", filters.brands.join(","));
    }

    // PRICE
    if (filters.price) {
      params.set("price", filters.price);
    }

    // SEARCH
    if (filters.search) {
      params.set("search", filters.search);
    }

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, [filters, pathname, router]);

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // CATEGORY
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      // BRAND
      const brandMatch =
        filters.brands.length === 0 || filters.brands.includes(product.brand);

      // PRICE
      const priceMatch = product.price <= filters.price;

      // SEARCH
      const searchMatch = product.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      return categoryMatch && brandMatch && priceMatch && searchMatch;
    });
  }, [filters]);

  return (
    <section className="py-5 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* SIDEBAR */}
          <ProductFilters filters={filters} setFilters={setFilters} />

          {/* PRODUCTS */}
          <div>
            <ProductSort />

            {/* SEARCH */}
            {/* <div className="mt-4">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value,
                  })
                }
                className="h-12 w-full rounded-xl border px-4 outline-none"
              />
            </div> */}

            {/* ACTIVE FILTERS */}
            <div className=" flex flex-wrap gap-2">
              {filters.categories.map((item) => (
                <button
                  key={item}
                  className="rounded-full bg-black px-4 py-2 text-sm text-white"
                >
                  {item}
                </button>
              ))}

              {filters.brands.map((item) => (
                <button
                  key={item}
                  className="rounded-full border px-4 py-2 text-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* PRODUCTS */}
            <div className="mt-5">
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
