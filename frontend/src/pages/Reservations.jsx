import { useState } from "react";
import { api } from "../api/client.js";
import "../styles/reservations.css";

const initialForm = { name: "", guests: 2, reservedAt: "", contact: "", notes: "" };

export default function Reservations() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [result, setResult] = useState(null);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await api.createReservation({
        ...form,
        guests: Number(form.guests),
      });
      setResult(res);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setResult({ error: err.message });
    }
  };

  if (status === "done" && result?.reservation) {
    return (
      <div className="res-page">
        <div className="res-bg" />
        <div className="res-bg-glow" />
        <div className="res-content">
          <div className="res-confirm-card">
            <p className="res-eyebrow">
              Reservation #{result.reservation.id} confirmed
            </p>
            <h1 className="res-confirm-title">
              See you soon, {result.reservation.name}
            </h1>
            <p className="res-confirm-detail">
              {result.reservation.guests} guests ·{" "}
              {new Date(result.reservation.reserved_at).toLocaleString()}
            </p>
            {result.ai_note && (
              <p className="res-confirm-note">{result.ai_note}</p>
            )}
            <button
              onClick={() => {
                setForm(initialForm);
                setStatus("idle");
              }}
              className="res-confirm-btn"
            >
              Book another table
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="res-page">
      <div className="res-bg" />
      <div className="res-bg-glow" />

      <div className="res-content">
        <div className="res-card">
          <p className="res-eyebrow">Reserve a table</p>
          <h1 className="res-title">Save your spot</h1>

          <form onSubmit={handleSubmit} className="res-form">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={update("name")}
              className="res-input"
              required
            />
            <div className="res-row">
              <input
                type="number"
                min="1"
                placeholder="Guests"
                value={form.guests}
                onChange={update("guests")}
                className="res-input-guests"
                required
              />
              <input
                type="datetime-local"
                value={form.reservedAt}
                onChange={update("reservedAt")}
                className="res-input-datetime"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Contact (phone or email)"
              value={form.contact}
              onChange={update("contact")}
              className="res-input"
            />
            <textarea
              placeholder="Notes (allergies, occasion, seating preference…)"
              value={form.notes}
              onChange={update("notes")}
              rows={3}
              className="res-textarea"
            />

            {status === "error" && <p className="res-error">{result?.error}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="res-submit-btn"
            >
              {status === "submitting" ? "Booking…" : "Confirm reservation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}