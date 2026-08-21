import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const links = [
  { to: "/menu", label: "Menu" },
  { to: "/chat", label: "Ask AI" },
  { to: "/reservations", label: "Reserve" },
];

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const transparent = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-bone/10 bg-ink/85 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="group flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-brass/60 font-display text-sm text-brass transition-colors group-hover:bg-brass group-hover:text-ink">
            TK
          </span>
          <span className="font-display text-lg tracking-tight text-bone">
            The Kitchen
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 transition-colors ${
                  isActive
                    ? "text-brass"
                    : "text-bone/70 hover:bg-bone/5 hover:text-bone"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `ml-1 flex items-center gap-2 rounded-full border px-4 py-1.5 transition-colors ${
                isActive
                  ? "border-brass bg-brass text-ink"
                  : "border-bone/25 text-bone hover:border-brass hover:text-brass"
              }`
            }
          >
            Ticket
            {itemCount > 0 && (
              <span className="rounded-full bg-ember px-1.5 py-0.5 font-mono text-[0.65rem] text-bone">
                {itemCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
