
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Menu from "./pages/Menu.jsx";
import Chat from "./pages/Chat.jsx";
import Cart from "./pages/Cart.jsx";
import Reservations from "./pages/Reservations.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 font-body text-stone-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
    </div>
  );
}
