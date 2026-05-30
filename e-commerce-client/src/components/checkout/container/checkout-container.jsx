// import CheckoutHeader from "./CheckoutHeader";
// import CheckoutForm from "./CheckoutForm";
// import OrderSummary from "./OrderSummary";
// import SecureCheckout from "./SecureCheckout";

import CheckoutForm from "../components/checkout-form";
import CheckoutHeader from "../components/checkout-header";
import OrderSummary from "../components/order-summary";
import SecureCheckout from "../components/secure-checkout";


const cartItems = [
  {
    id: 1,
    title: "Sony WH-1000XM5",
    price: 349.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },

  {
    id: 2,
    title: "Nike Air Force 1",
    price: 129.99,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
];

export default function CheckoutContainer() {
  return (
    <section className="bg-background py-10">
      <div className="container mx-auto px-4">
        <CheckoutHeader />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <CheckoutForm />

          <div className="space-y-6">
            <OrderSummary items={cartItems} />

            <SecureCheckout />
          </div>
        </div>
      </div>
    </section>
  );
}