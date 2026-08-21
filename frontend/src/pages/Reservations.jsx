import { useState } from "react";
import { api } from "../api/client.js";
import reservationsImage from "../assets/reservations.jpg";

const initialForm = { name: "", guests: 2, reservedAt: "", contact: "", notes: "" };

const inputClass =
  "w-full rounded-xl border border-bone/15 bg-ink px-4 py-3 text-sm text-bone [color-scheme:dark] placeholder:text-bone/35 transition-colors focus:border-brass focus:outline-none";

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

  const confirmed = status === "done" && result?.reservation;

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      {/* Image side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={reservationsImage}
          alt="Set dining table in the restaurant"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="eyebrow">The room</p>
          <h2 className="mt-3 max-w-sm font-display text-4xl leading-tight text-bone">
            Candlelight, low music, and your table waiting
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/65">
            We hold every booking for 20 minutes. Tell us about allergies or
            the occasion and the kitchen will plan around it.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <img
          src={reservationsImage}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-20 lg:hidden"
        />
        <div className="absolute inset-0 bg-ink/80 lg:hidden" />

        <div className="relative z-10 w-full max-w-md">
          {confirmed ? (
            <div className="animate-rise rounded-3xl border border-brass/40 bg-ink-soft p-8 text-center shadow-ticket">
              <p className="eyebrow">
                Reservation #{result.reservation.id} confirmed
              </p>
              <h1 className="mt-4 font-display text-3xl text-bone">
                See you soon, {result.reservation.name}
              </h1>
              <p className="mt-4 font-mono text-sm text-brass">
                {result.reservation.guests} guests ·{" "}
                {new Date(result.reservation.reserved_at).toLocaleString()}
              </p>
              {result.ai_note && (
                <p className="mt-4 text-sm leading-relaxed text-bone/60">
                  {result.ai_note}
                </p>
              )}
              <button
                onClick={() => {
                  setForm(initialForm);
                  setResult(null);
                  setStatus("idle");
                }}
                className="mt-8 w-full rounded-full bg-brass py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
              >
                Book another table
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-bone/10 bg-ink-soft p-8 shadow-ticket">
              <p className="eyebrow">Reserve a table</p>
              <h1 className="mt-3 font-display text-3xl text-bone">
                Save your spot
              </h1>
              <p className="mt-2 text-sm text-bone/55">
                No account needed — we'll confirm instantly.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={update("name")}
                  className={inputClass}
                  required
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[7rem_1fr]">
                  <input
                    type="number"
                    min="1"
                    placeholder="Guests"
                    value={form.guests}
                    onChange={update("guests")}
                    className={inputClass}
                    required
                  />
                  <input
                    type="datetime-local"
                    value={form.reservedAt}
                    onChange={update("reservedAt")}
                    className={inputClass}
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Contact (phone or email)"
                  value={form.contact}
                  onChange={update("contact")}
                  className={inputClass}
                />

                <textarea
                  placeholder="Notes (allergies, occasion, seating preference…)"
                  value={form.notes}
                  onChange={update("notes")}
                  rows={3}
                  className={`${inputClass} resize-none`}
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
                  {status === "submitting" ? "Booking…" : "Confirm reservation"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
