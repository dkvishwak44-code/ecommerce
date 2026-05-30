export default function CouponBox() {
  return (
    <div className="mt-8 flex overflow-hidden rounded-2xl border">
      <input
        type="text"
        placeholder="Coupon code"
        className="h-14 flex-1 bg-background px-4 outline-none"
      />

      <button className="bg-primary px-6 text-white">
        Apply
      </button>
    </div>
  );
}