import { useCart } from "../context/CartContext.jsx";

export default function MenuItemCard({ item }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col justify-between rounded-lg border border-stone-200 bg-white p-5 transition-colors hover:border-amber-300 hover:shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-stone-900">
            {item.name}
          </h3>
          <span className="whitespace-nowrap font-mono text-sm text-amber-700">
            ${item.price.toFixed(2)}
          </span>
        </div>
        {item.description && (
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            {item.description}
          </p>
        )}
        {item.category && (
          <span className="mt-3 inline-block text-xs uppercase tracking-wider text-stone-400">
            {item.category}
          </span>
        )}
      </div>
      <button
        onClick={() => addItem(item)}
        disabled={item.available === false}
        className="mt-4 rounded-md border border-amber-600 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-600 hover:text-white disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-300 disabled:hover:bg-transparent"
      >
        {item.available === false ? "Unavailable" : "Add to ticket"}
      </button>
    </div>
  );
}