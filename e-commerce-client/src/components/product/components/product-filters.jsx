// components/products/ProductFilters.jsx

"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export default function ProductFilters({ filters, setFilters }) {
  // ACCORDION STATES
  const [openCategory, setOpenCategory] = useState(true);

  const [openBrand, setOpenBrand] = useState(true);

  const [openPrice, setOpenPrice] = useState(true);

  // DATA
  const categories = [
    "Fashion",
    "Shoes",
    "Electronics",
    "Beauty",
    "Accessories",
    "Watches",
    "Bags",
    "Gaming",
    "Furniture",
  ];

  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Apple",
    "Samsung",
    "Sony",
    "Zara",
    "H&M",
    "Gucci",
    "Rolex",
    "Asus",
    "Lenovo",
  ];

  // CATEGORY HANDLE
  const handleCategoryChange = (category) => {
    const exists = filters.categories.includes(category);

    if (exists) {
      setFilters({
        ...filters,
        categories: filters.categories.filter((item) => item !== category),
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, category],
      });
    }
  };

  // BRAND HANDLE
  const handleBrandChange = (brand) => {
    const exists = filters.brands.includes(brand);

    if (exists) {
      setFilters({
        ...filters,
        brands: filters.brands.filter((item) => item !== brand),
      });
    } else {
      setFilters({
        ...filters,
        brands: [...filters.brands, brand],
      });
    }
  };

  // PRICE HANDLE
  const handlePriceChange = (e) => {
    setFilters({
      ...filters,
      price: Number(e.target.value),
    });
  };

  // CLEAR FILTERS
  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      price: 10000,
      search: "",
    });
  };

  return (
    <aside className="sticky top-4 h-[calc(100vh-32px)] overflow-y-auto border p-6 ">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold">Filters</h2>

        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* CATEGORY */}
      <div className="mt-6 border-b pb-6">
        <button
          onClick={() => setOpenCategory(!openCategory)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-lg font-semibold">Categories</h3>

          {openCategory ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {openCategory && (
          <div className="mt-5 space-y-4">
            {categories.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center justify-between rounded-lg transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(item)}
                    onChange={() => handleCategoryChange(item)}
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <span className="text-sm">{item}</span>
                </div>

                <span className="text-xs text-gray-400">120</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="mt-6 border-b pb-6">
        <button
          onClick={() => setOpenPrice(!openPrice)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-lg font-semibold">Price Range</h3>

          {openPrice ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {openPrice && (
          <div className="mt-6">
            <input
              type="range"
              min="0"
              max="10000"
              value={filters.price}
              onChange={handlePriceChange}
              className="w-full cursor-pointer"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="rounded-lg border px-4 py-2 text-sm font-medium">
                ₹0
              </div>

              <div className="rounded-lg border px-4 py-2 text-sm font-medium">
                ₹{filters.price}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BRANDS */}
      <div className="mt-6">
        <button
          onClick={() => setOpenBrand(!openBrand)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-lg font-semibold">Brands</h3>

          {openBrand ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {openBrand && (
          <div className="mt-5 space-y-4">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center justify-between rounded-lg transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <span className="text-sm">{brand}</span>
                </div>

                <span className="text-xs text-gray-400">54</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
