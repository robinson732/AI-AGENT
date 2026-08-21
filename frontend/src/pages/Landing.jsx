import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import menuImage from "../assets/menu.jpg";
import reservationsImage from "../assets/reservations.jpg";

const highlights = [
  {
    to: "/menu",
    image: menuImage,
    eyebrow: "The menu",
    title: "Small plates, big fire",
    body: "Seasonal dishes cooked over open flame. Build your ticket and send it straight to the pass.",
    cta: "Browse the menu",
  },
  {
    to: "/reservations",
    image: reservationsImage,
    eyebrow: "The room",
    title: "A table with your name",
    body: "Warm light, low music, and a seat saved for you. Reserve in under a minute.",
    cta: "Reserve a table",
  },
];

const steps = [
  {
    step: "01",
    title: "Ask the kitchen",
    body: "Tell our assistant your budget, cravings, or allergies and get a real recommendation from tonight's menu.",
  },
  {
    step: "02",
    title: "Build your ticket",
    body: "Add dishes as you browse. Prices are calculated by the kitchen, never guessed.",
  },
  {
    step: "03",
    title: "Eat well",
    body: "Send the order or book a table. You'll get an order number the moment the pass receives it.",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-[73px] flex min-h-[92vh] items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Chef plating a dish in the kitchen"
          className="absolute inset-0 size-full scale-105 object-cover brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <div className="grain absolute inset-0 opacity-50" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-20">
          <div className="max-w-xl animate-rise">
            <p className="eyebrow">Wood fire · Nairobi · Est. 2024</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-bone sm:text-6xl lg:text-7xl">
              Honest food,
              <span className="block text-brass">made to order.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-bone/70">
              Order ahead, reserve a table, or let our kitchen assistant pick
              your dinner. Everything you see is cooked fresh tonight.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/menu"
                className="rounded-full bg-brass px-7 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 hover:bg-brass/90"
              >
                View the menu
              </Link>
              <Link
                to="/reservations"
                className="rounded-full border border-bone/30 px-7 py-3 text-sm font-medium text-bone transition-colors hover:border-brass hover:text-brass"
              >
                Reserve a table
              </Link>
              <Link
                to="/chat"
                className="group inline-flex items-center gap-2 px-1 py-3 text-sm text-bone/70 transition-colors hover:text-brass"
              >
                Ask the AI
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-bone/15 pt-8">
              {[
                ["Open daily", "11:00 – 23:00"],
                ["Kitchen", "Fired to order"],
                ["Booking", "No account needed"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone/40">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-bone/85">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Image highlights */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {highlights.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl border border-bone/10"
            >
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/25" />
              <div className="relative z-10 p-8">
                <p className="eyebrow">{card.eyebrow}</p>
                <h2 className="mt-3 font-display text-3xl text-bone">
                  {card.title}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/70">
                  {card.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-brass">
                  {card.cta}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-bone/10 bg-ink-soft">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 max-w-lg font-display text-3xl text-bone sm:text-4xl">
            From craving to table in three steps
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-bone/10 bg-bottle/30 p-7 transition-colors hover:border-brass/40"
              >
                <span className="font-mono text-sm text-brass">{item.step}</span>
                <h3 className="mt-4 font-display text-xl text-bone">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/60">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="eyebrow">Tonight</p>
        <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
          The pass is open and the fire is lit
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-bone/60">
          Browse the full menu, build your ticket, and send it straight to the
          kitchen — no account needed.
        </p>
        <Link
          to="/menu"
          className="mt-8 inline-block rounded-full bg-brass px-8 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
        >
          Start your order
        </Link>
      </section>
    </div>
  );
}
