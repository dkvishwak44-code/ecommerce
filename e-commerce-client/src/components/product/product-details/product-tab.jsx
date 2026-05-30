"use client";

import { useState } from "react";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div>
      {/* TABS */}
      <div className="flex gap-8 border-b">
        {["description", "reviews", "shipping"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-2 py-4 text-sm font-medium capitalize transition ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-8 max-w-4xl leading-8 text-muted-foreground">
        {activeTab === "description" && product.description}

        {activeTab === "reviews" &&
          "Amazing quality product with premium finishing."}

        {activeTab === "shipping" && "Delivery within 3-5 business days."}
      </div>
    </div>
  );
}
