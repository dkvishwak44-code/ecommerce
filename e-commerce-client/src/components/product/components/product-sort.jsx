// components/products/ProductSort.jsx

export default function ProductSort() {
  return (
    <div className="flex items-center justify-between rounded-2xl p-4 bg-background">
      <p className="text-sm text-gray-500">Showing 1-8 products</p>

      <select className="rounded-xl border bg-background px-4 py-2 outline-none">
        <option>Popularity</option>
        <option>Latest</option>
        <option>Low To High</option>
        <option>High To Low</option>
      </select>
    </div>
  );
}
