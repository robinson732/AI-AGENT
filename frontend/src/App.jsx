import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Menu from "./pages/Menu.jsx";
import Chat from "./pages/Chat.jsx";
import Cart from "./pages/Cart.jsx";
import Reservations from "./pages/Reservations.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ink font-body text-bone">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
