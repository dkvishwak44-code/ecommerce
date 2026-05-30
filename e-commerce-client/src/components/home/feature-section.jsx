// components/home/FeaturesSection.jsx

export default function FeaturesSection() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-4">
        <div className="rounded-2xl p-6 shadow-sm border bg-background  border-gray-200  dark:border-gray-800 ">
          <h3 className="mb-2 font-semibold">Free Shipping</h3>

          <p className="text-sm text-gray-500">On all orders above ₹999</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm  bg-background   border  border-gray-200  dark:border-gray-800">
          <h3 className="mb-2 font-semibold">Secure Payment</h3>

          <p className="text-sm text-gray-500">100% secure payment</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm  bg-background  border  border-gray-200  dark:border-gray-800">
          <h3 className="mb-2 font-semibold">Fast Delivery</h3>

          <p className="text-sm text-gray-500">Delivery within 3-5 days</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm   bg-background  border  border-gray-200  dark:border-gray-800">
          <h3 className="mb-2 font-semibold">24/7 Support</h3>

          <p className="text-sm text-gray-500">Dedicated support team</p>
        </div>
      </div>
    </section>
  );
}
