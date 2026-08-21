import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "../styles/landing.css";

export default function Landing() {
  return (
    <div>
      <div className="landing-hero">
        <img src={heroImage} alt="" className="landing-hero-image" />
        <div className="landing-hero-overlay" />
        <div className="landing-hero-glow" />

        <div className="landing-hero-content">
          <p className="landing-eyebrow">Welcome to</p>
          <h1 className="landing-title">The Kitchen</h1>
          <p className="landing-subtitle">
            Honest food, made fresh. Order ahead, reserve a table, or ask
            our kitchen assistant what to try tonight.
          </p>

          <div className="landing-actions">
            <Link to="/menu" className="landing-btn-primary">
              View menu
            </Link>
            <Link to="/reservations" className="landing-btn-secondary">
              Reserve a table
            </Link>
            <Link to="/chat" className="landing-btn-secondary">
              Ask the AI
            </Link>
          </div>
        </div>
      </div>

      <section className="landing-section">
        <p className="landing-section-eyebrow">Tonight</p>
        <h2 className="landing-section-title">
          Fresh ingredients, cooked to order
        </h2>
        <p className="landing-section-body">
          Browse the full menu, build your ticket, and send it straight to
          the kitchen — no account needed.
        </p>
      </section>
    </div>
  );
}