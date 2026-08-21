import { useCart } from "../context/CartContext.jsx";

export default function MenuItemCard({ item }) {
  const { addItem } = useCart();
  const unavailable = item.available === false;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-bone/10 bg-ink-soft p-6 transition-all hover:-translate-y-1 hover:border-brass/50 hover:shadow-ticket">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-bone">
            {item.name}
          </h3>
          <span className="whitespace-nowrap rounded-full bg-brass/15 px-2.5 py-1 font-mono text-sm text-brass">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="mt-3 text-sm leading-relaxed text-bone/60">
            {item.description}
          </p>
        )}

        {item.category && (
          <span className="mt-4 inline-block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone/35">
            {item.category}
          </span>
        )}
      </div>

      <button
        onClick={() => addItem(item)}
        disabled={unavailable}
        className="mt-6 rounded-full border border-brass/70 py-2.5 text-sm font-medium text-brass transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:border-bone/15 disabled:text-bone/30 disabled:hover:bg-transparent disabled:hover:text-bone/30"
      >
        {unavailable ? "Sold out" : "Add to ticket"}
      </button>
    </article>
  );
}
