import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api/client.js";
import "../styles/cart.css";

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
      <div className="cart-confirm-page">
        <p className="cart-eyebrow">Order #{result.order.id} placed</p>
        <h1 className="cart-confirm-title">
          Thanks, {result.order.customer_name}
        </h1>
        {result.ai_summary && (
          <p className="cart-confirm-note">{result.ai_summary}</p>
        )}
        <button onClick={() => navigate("/")} className="cart-confirm-btn">
          Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <p className="cart-eyebrow">Your ticket</p>
      <h1 className="cart-title">Review &amp; send to kitchen</h1>

      {items.length === 0 ? (
        <p className="cart-empty">Nothing on the ticket yet.</p>
      ) : (
        <div className="cart-ticket">
          <div className="cart-ticket-items">
            {items.map((it, i) => (
              <div key={it.id}>
                <div className="cart-line">
                  <div className="cart-line-left">
                    <button
                      onClick={() => updateQty(it.id, it.qty - 1)}
                      className="cart-qty-btn"
                      aria-label={`Decrease ${it.name}`}
                    >
                      −
                    </button>
                    <span className="cart-qty-value">{it.qty}</span>
                    <button
                      onClick={() => updateQty(it.id, it.qty + 1)}
                      className="cart-qty-btn"
                      aria-label={`Increase ${it.name}`}
                    >
                      +
                    </button>
                    <span className="cart-item-name">{it.name}</span>
                  </div>
                  <div className="cart-line-right">
                    <span>${(it.price * it.qty).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="cart-remove-btn"
                      aria-label={`Remove ${it.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
                {i < items.length - 1 && <div className="cart-divider" />}
              </div>
            ))}
          </div>
          <div className="cart-dashed" />
          <div className="cart-total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <form onSubmit={handleSubmit} className="cart-form">
          <input
            type="text"
            placeholder="Name for the order"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="cart-input"
            required
          />
          {status === "error" && <p className="cart-error">{result?.error}</p>}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="cart-submit-btn"
          >
            {status === "submitting" ? "Sending to kitchen…" : "Send order"}
          </button>
        </form>
      )}
    </div>
  );
}