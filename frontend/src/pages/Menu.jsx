import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import MenuItemCard from "../components/MenuItemCard.jsx";
import menuImage from "../assets/menu.jpg";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api
      .getMenu()
      .then((data) => {
        setMenu(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(menu.map((item) => item.category || "Other"))];
    return ["All", ...unique];
  }, [menu]);

  const visible = useMemo(
    () =>
      activeCategory === "All"
        ? menu
        : menu.filter((item) => (item.category || "Other") === activeCategory),
    [menu, activeCategory]
  );

  const grouped = visible.reduce((acc, item) => {
    const key = item.category || "Other";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div>
      {/* Banner */}
      <section className="relative flex h-72 items-end overflow-hidden sm:h-80">
        <img
          src={menuImage}
          alt="Dishes plated on a table"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/45" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10">
          <p className="eyebrow">Tonight's menu</p>
          <h1 className="mt-3 font-display text-4xl text-bone sm:text-5xl">
            Everything is fired to order
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {status === "ready" && menu.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  activeCategory === category
                    ? "border-brass bg-brass text-ink"
                    : "border-bone/20 text-bone/70 hover:border-brass/60 hover:text-brass"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {status === "loading" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-bone/10 bg-bottle/20"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-ember/40 bg-ember/10 p-8 text-center">
            <p className="font-display text-xl text-bone">
              Couldn't reach the kitchen
            </p>
            <p className="mt-2 text-sm text-bone/60">
              Check that the backend is running, then refresh this page.
            </p>
          </div>
        )}

        {status === "ready" && menu.length === 0 && (
          <div className="rounded-2xl border border-bone/10 bg-ink-soft p-8 text-center">
            <p className="font-display text-xl text-bone">
              The menu is still being written
            </p>
            <p className="mt-2 text-sm text-bone/60">
              Add menu items from the backend and they'll appear here.
            </p>
          </div>
        )}

        {status === "ready" &&
          Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="mb-14">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-display text-2xl text-brass">{category}</h2>
                <span className="h-px flex-1 bg-bone/10" />
                <span className="font-mono text-xs text-bone/40">
                  {items.length} {items.length === 1 ? "dish" : "dishes"}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}

        {status === "ready" && (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-bone/10 bg-ink-soft p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-display text-xl text-bone">
                Not sure what to pick?
              </p>
              <p className="mt-1 text-sm text-bone/60">
                Tell the kitchen assistant your budget and cravings.
              </p>
            </div>
            <Link
              to="/chat"
              className="rounded-full border border-brass px-6 py-2.5 text-sm text-brass transition-colors hover:bg-brass hover:text-ink"
            >
              Ask the AI
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
