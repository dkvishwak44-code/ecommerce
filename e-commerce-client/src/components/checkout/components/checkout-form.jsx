// import ShippingForm from "./ShippingForm";
// import PaymentMethod from "./PaymentMethod";

import PaymentMethod from "./payment-method";
import ShippingForm from "./shipping-form";

export default function CheckoutForm() {
  return (
    <div className="space-y-6">
      <ShippingForm />

      <PaymentMethod />
    </div>
  );
}