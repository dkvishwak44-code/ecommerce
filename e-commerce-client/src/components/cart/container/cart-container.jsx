"use client";

import CartHeader from "../components/cart-header";
import CartItems from "../components/cart-items";
import CartSummary from "../components/cart-summary";
import PaymentMethods from "../components/payment-method";

// import CartHeader from "./CartHeader";
// import CartItems from "./CartItems";
// import CartSummary from "./CartSummary";
// import PaymentMethods from "./PaymentMethods";

const cartItems = [
  {
    id: 1,
    title: "Sony WH-1000XM5",
    description: "Wireless Noise Cancelling Headphones",
    color: "Black",
    price: 349.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },

  {
    id: 2,
    title: "Samsung Galaxy Watch 6",
    description: "44mm, Bluetooth",
    color: "Black",
    price: 199.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
  },

  {
    id: 3,
    title: "Nike Air Force 1",
    description: "Men's Shoes",
    color: "White",
    price: 99.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
];

export default function CartContainer() {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4">
        <CartHeader />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <CartItems items={cartItems} />

          <CartSummary items={cartItems} />
        </div>

        <PaymentMethods />
      </div>
    </section>
  );
}