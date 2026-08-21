import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import MenuItemCard from "../components/MenuItemCard.jsx";
import "../styles/menu.css";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    api
      .getMenu()
      .then((data) => {
        setMenu(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const grouped = menu.reduce((acc, item) => {
    const key = item.category || "Other";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-page">
      <div className="menu-header">
        <p className="menu-eyebrow">Tonight's menu</p>
        <h1 className="menu-title">Order ahead, or reserve a table</h1>
      </div>

      {status === "loading" && (
        <p className="menu-status-loading">Loading the menu…</p>
      )}

      {status === "error" && (
        <p className="menu-status-error">
          Couldn't reach the kitchen. Check that the backend is running and
          try again.
        </p>
      )}

      {status === "ready" && menu.length === 0 && (
        <p className="menu-status-loading">
          No menu items yet — add some from the backend to see them here.
        </p>
      )}

      {status === "ready" &&
        Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="menu-section">
            <h2 className="menu-section-title">{category}</h2>
            <div className="menu-grid">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}