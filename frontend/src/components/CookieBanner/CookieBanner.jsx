import { useEffect, useState } from "react";

import {
  COOKIE_BANNER_TITLE,
  COOKIE_BANNER_DESCRIPTION,
  COOKIE_BANNER_LEARN_MORE_LABEL,
  COOKIE_BANNER_LEARN_MORE_URL,
  COOKIE_BANNER_ACCEPT_LABEL,
  COOKIE_BANNER_REJECT_LABEL,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_REJECTED,
} from "./data";

import "./CookieBanner.css";

function CookieBanner() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (storedConsent) return undefined;

    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
    setIsLeaving(true);
    setTimeout(() => setIsMounted(false), 300);
  };

  if (!isMounted) return null;

  const bannerClassName = isLeaving
    ? "cookie-banner cookie-banner--leaving"
    : "cookie-banner";

  return (
    <aside className={bannerClassName} aria-label="Aviso de cookies">
      <h2 className="cookie-banner__title">{COOKIE_BANNER_TITLE}</h2>
      <p className="cookie-banner__text">{COOKIE_BANNER_DESCRIPTION}</p>
      <a
        href={COOKIE_BANNER_LEARN_MORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="cookie-banner__link"
      >
        {COOKIE_BANNER_LEARN_MORE_LABEL}
      </a>
      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--secondary"
          onClick={() => handleConsent(COOKIE_CONSENT_REJECTED)}
        >
          {COOKIE_BANNER_REJECT_LABEL}
        </button>
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--primary"
          onClick={() => handleConsent(COOKIE_CONSENT_ACCEPTED)}
        >
          {COOKIE_BANNER_ACCEPT_LABEL}
        </button>
      </div>
    </aside>
  );
}

export default CookieBanner;
