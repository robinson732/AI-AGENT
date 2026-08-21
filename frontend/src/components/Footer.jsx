import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-bone">The Kitchen</p>
          <p className="mt-1 text-sm text-bone/50">
            Open daily · 11:00 – 23:00 · Nairobi
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-bone/60">
          <Link to="/menu" className="transition-colors hover:text-brass">
            Menu
          </Link>
          <Link to="/reservations" className="transition-colors hover:text-brass">
            Reservations
          </Link>
          <Link to="/chat" className="transition-colors hover:text-brass">
            Ask the AI
          </Link>
          <Link to="/cart" className="transition-colors hover:text-brass">
            Your ticket
          </Link>
        </nav>
      </div>
    </footer>
  );
}
