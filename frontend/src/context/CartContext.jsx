import { createContext, useContext, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, name, price, qty }]

  const addItem = useCallback((menuItem) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === menuItem.id);
      if (existing) {
        return prev.map((it) =>
          it.id === menuItem.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [...prev, { id: menuItem.id, name: menuItem.name, price: menuItem.price, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((it) => it.id !== id);
      return prev.map((it) => (it.id === id ? { ...it, qty } : it));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const value = { items, addItem, removeItem, updateQty, clearCart, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}