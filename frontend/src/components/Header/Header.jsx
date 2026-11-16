import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import {
  HEADER_LOGO_TEXT,
  HEADER_LOGO_IMAGE,
  HEADER_LOGO_ALT,
  HEADER_NAV_LINKS,
  HEADER_SIGN_IN_LABEL,
  HEADER_SIGN_OUT_LABEL,
} from "./data";

import "./Header.css";

function Header({ variant = "transparent", onSignInClick, onSignOut }) {
  const currentUser = useContext(CurrentUserContext);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLoggedIn = Boolean(currentUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolid = variant === "solid" || isScrolled;
  const headerClassName = isSolid ? "header header--scrolled" : "header";

  return (
    <header className={headerClassName}>
      <div className="header__inner container">
        <Link to="/" className="header__logo">
          <img
            src={HEADER_LOGO_IMAGE}
            alt={HEADER_LOGO_ALT}
            className="header__logo-image"
          />
          <span className="header__logo-text">{HEADER_LOGO_TEXT}</span>
        </Link>

        <nav className="header__nav" aria-label="Navegação principal">
          <div className="header__nav-links">
            {HEADER_NAV_LINKS.map((link) => {
              const isAnchor = link.to.includes("#");

              if (isAnchor) {
                return (
                  <Link key={link.id} to={link.to} className="header__nav-link">
                    {link.label}
                  </Link>
                );
              }

              return (
                <NavLink
                  key={link.id}
                  to={link.to}
                  className="header__nav-link"
                  activeClassName="header__nav-link--active"
                  exact={link.to === "/"}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {isLoggedIn ? (
            <button
              type="button"
              onClick={onSignOut}
              className="header__login-btn"
            >
              {HEADER_SIGN_OUT_LABEL}
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignInClick}
              className="header__login-btn"
            >
              {HEADER_SIGN_IN_LABEL}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
