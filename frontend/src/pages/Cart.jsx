import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api/client.js";

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) return;

    setStatus("submitting");
    try {
      const res = await api.createOrder(customerName.trim(), items);
      setResult(res);
      setStatus("done");
      clearCart();
    } catch (err) {
      setStatus("error");
      setResult({ error: err.message });
    }
  };

  if (status === "done" && result?.order) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="animate-rise rounded-3xl border border-brass/40 bg-ink-soft p-10 shadow-ticket">
          <p className="eyebrow">Order #{result.order.id} placed</p>
          <h1 className="mt-4 font-display text-3xl text-bone">
            Thanks, {result.order.customer_name}
          </h1>
          <p className="mt-3 text-sm text-bone/60">
            The pass has your ticket. We'll start firing right away.
          </p>
          {result.ai_summary && (
            <p className="mt-4 text-sm leading-relaxed text-bone/60">
              {result.ai_summary}
            </p>
          )}
          <button
            onClick={() => navigate("/menu")}
            className="mt-8 w-full rounded-full bg-brass py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Back to the menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="eyebrow">Your ticket</p>
      <h1 className="mt-3 font-display text-4xl text-bone">
        Review &amp; send to the kitchen
      </h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-bone/15 bg-ink-soft p-12 text-center">
          <p className="font-display text-xl text-bone">
            Nothing on the ticket yet
          </p>
          <p className="mt-2 text-sm text-bone/55">
            Add a few dishes and they'll show up here.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-full border border-brass px-6 py-2.5 text-sm text-brass transition-colors hover:bg-brass hover:text-ink"
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 overflow-hidden rounded-3xl border border-bone/10 bg-ink-soft shadow-ticket">
            <div className="divide-y divide-bone/10">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-bone/15 px-2 py-1">
                      <button
                        onClick={() => updateQty(it.id, it.qty - 1)}
                        className="size-6 rounded-full text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
                        aria-label={`Decrease ${it.name}`}
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-mono text-sm text-bone">
                        {it.qty}
                      </span>
                      <button
                        onClick={() => updateQty(it.id, it.qty + 1)}
                        className="size-6 rounded-full text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
                        aria-label={`Increase ${it.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-bone">{it.name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-brass">
                      ${(it.price * it.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="text-bone/35 transition-colors hover:text-ember"
                      aria-label={`Remove ${it.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-dashed border-bone/20 bg-bottle/20 px-6 py-5">
              <span className="font-display text-lg text-bone">Total</span>
              <span className="font-mono text-lg text-brass">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Name for the order"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-bone/15 bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-bone/35 transition-colors focus:border-brass focus:outline-none"
              required
            />

            {status === "error" && (
              <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
                {result?.error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-brass py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "submitting" ? "Sending to kitchen…" : "Send order"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
