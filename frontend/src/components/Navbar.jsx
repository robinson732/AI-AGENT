
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "../styles/navbar.css";

const links = [
  { to: "/menu", label: "Menu" },
  { to: "/chat", label: "Ask AI" },
  { to: "/reservations", label: "Reserve" },
];

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          The Kitchen
        </NavLink>
        <nav className="navbar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "navbar-link-active" : "navbar-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "navbar-ticket-active" : "navbar-ticket"
            }
          >
            Ticket
            {itemCount > 0 && <span className="navbar-badge">{itemCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
