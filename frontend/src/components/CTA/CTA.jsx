import {
  CTA_EYEBROW,
  CTA_TITLE,
  CTA_TEXT,
  CTA_PRIMARY_LABEL,
  CTA_SECONDARY_LABEL,
} from "./data";

import "./CTA.css";

function CTA({ onCreateAccountClick, onSignInClick }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta__inner container">
        <div className="cta__content">
          <p className="cta__eyebrow">{CTA_EYEBROW}</p>

          <h2 id="cta-title" className="cta__title">
            {CTA_TITLE}
          </h2>

          <p className="cta__text">{CTA_TEXT}</p>

          <div className="cta__actions">
            <button
              type="button"
              onClick={onCreateAccountClick}
              className="cta__btn cta__btn--primary"
            >
              {CTA_PRIMARY_LABEL}
            </button>
            <button
              type="button"
              onClick={onSignInClick}
              className="cta__btn cta__btn--secondary"
            >
              {CTA_SECONDARY_LABEL}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
