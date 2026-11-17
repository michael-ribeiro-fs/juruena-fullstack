import { Link } from "react-router-dom";

import {
  FOOTER_LOGO_TEXT,
  FOOTER_LOGO_IMAGE,
  FOOTER_LOGO_ALT,
  FOOTER_TAGLINE,
  FOOTER_NAV_HEADING,
  FOOTER_NAV_LINKS,
  FOOTER_CREDITS_HEADING,
  FOOTER_CREDITS_PAIRS,
  FOOTER_CREDITS_NOTE,
  FOOTER_COPYRIGHT_YEAR,
  FOOTER_COPYRIGHT_OWNER,
  FOOTER_META_LOCATION,
  FOOTER_META_TYPE,
} from "./data";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__brand-logo">
              <img
                src={FOOTER_LOGO_IMAGE}
                alt={FOOTER_LOGO_ALT}
                className="footer__brand-image"
              />
              <span className="footer__brand-text">{FOOTER_LOGO_TEXT}</span>
            </Link>
            <p className="footer__brand-tagline">{FOOTER_TAGLINE}</p>
          </div>

          <div className="footer__nav-col">
            <h3 className="footer__heading">{FOOTER_NAV_HEADING}</h3>
            <ul className="footer__nav-list">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.id} className="footer__nav-item">
                  <Link to={link.to} className="footer__nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__credits-col">
            <h3 className="footer__heading">{FOOTER_CREDITS_HEADING}</h3>
            <div className="footer__credits-list">
              {FOOTER_CREDITS_PAIRS.map((pair) => (
                <p key={pair.id} className="footer__credits-item">
                  {pair.label}{" "}
                  <span className="footer__credits-source">{pair.source}</span>
                </p>
              ))}
              <p className="footer__credits-item footer__credits-item--note">
                {FOOTER_CREDITS_NOTE}
              </p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {FOOTER_COPYRIGHT_YEAR} {FOOTER_COPYRIGHT_OWNER}
          </p>
          <div className="footer__meta">
            <span className="footer__meta-item">{FOOTER_META_LOCATION}</span>
            <span className="footer__meta-item">{FOOTER_META_TYPE}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
