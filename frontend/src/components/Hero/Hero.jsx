import { Link } from "react-router-dom";

import {
  HERO_IMAGE_URL,
  HERO_IMAGE_ALT,
  HERO_EYEBROW_TEXT,
  HERO_TITLE_LINE_1,
  HERO_TITLE_LINE_2,
  HERO_SUBTITLE,
  HERO_PRIMARY_CTA_LABEL,
  HERO_PRIMARY_CTA_TO,
  HERO_SECONDARY_CTA_LABEL,
  HERO_SECONDARY_CTA_TO,
} from "./data";

import "./Hero.css";

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg">
        <img
          src={HERO_IMAGE_URL}
          alt={HERO_IMAGE_ALT}
          className="hero__bg-img"
        />
        <div className="hero__overlay-gradient" aria-hidden="true" />
        <div className="hero__overlay-tint" aria-hidden="true" />
      </div>

      <div className="hero__content-wrapper container">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-text">{HERO_EYEBROW_TEXT}</span>
          </p>

          <h1 id="hero-title" className="hero__title">
            {HERO_TITLE_LINE_1}
            <br />
            {HERO_TITLE_LINE_2}
          </h1>

          <p className="hero__subtitle">{HERO_SUBTITLE}</p>

          <div className="hero__actions">
            <Link
              to={HERO_PRIMARY_CTA_TO}
              className="hero__btn hero__btn--primary"
            >
              {HERO_PRIMARY_CTA_LABEL}
            </Link>
            <Link
              to={HERO_SECONDARY_CTA_TO}
              className="hero__btn hero__btn--secondary"
            >
              {HERO_SECONDARY_CTA_LABEL}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
