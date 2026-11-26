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
  HEADER_ADMIN_LINK,
  HEADER_MENU_OPEN_LABEL,
  HEADER_MENU_CLOSE_LABEL,
} from "./data";

import "./Header.css";

function Header({ variant = "transparent", onSignInClick, onSignOut }) {
  const currentUser = useContext(CurrentUserContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = Boolean(currentUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSolid = variant === "solid" || isScrolled || isMenuOpen;
  const headerClassName = isSolid ? "header header--scrolled" : "header";

  const handleToggleMenu = () => setIsMenuOpen((previous) => !previous);
  const handleCloseMenu = () => setIsMenuOpen(false);

  const navLinks =
    currentUser && currentUser.role === "admin"
      ? [...HEADER_NAV_LINKS, HEADER_ADMIN_LINK]
      : HEADER_NAV_LINKS;

  const renderNavLinks = (linkClassName, activeClassName) =>
    navLinks.map((link) => {
      const isAnchor = link.to.includes("#");

      if (isAnchor) {
        return (
          <Link
            key={link.id}
            to={link.to}
            className={linkClassName}
            onClick={handleCloseMenu}
          >
            {link.label}
          </Link>
        );
      }

      return (
        <NavLink
          key={link.id}
          to={link.to}
          className={linkClassName}
          activeClassName={activeClassName}
          exact={link.to === "/"}
          onClick={handleCloseMenu}
        >
          {link.label}
        </NavLink>
      );
    });

  const hamburgerClassName = isMenuOpen
    ? "header__hamburger header__hamburger--open"
    : "header__hamburger";

  const hamburgerLabel = isMenuOpen
    ? HEADER_MENU_CLOSE_LABEL
    : HEADER_MENU_OPEN_LABEL;

  return (
    <header className={headerClassName}>
      <div className="header__inner container">
        <Link to="/" className="header__logo" onClick={handleCloseMenu}>
          <img
            src={HEADER_LOGO_IMAGE}
            alt={HEADER_LOGO_ALT}
            className="header__logo-image"
          />
          <span className="header__logo-text">{HEADER_LOGO_TEXT}</span>
        </Link>

        <nav className="header__nav" aria-label="Navegação principal">
          <div className="header__nav-links">
            {renderNavLinks("header__nav-link", "header__nav-link--active")}
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

          <button
            type="button"
            className={hamburgerClassName}
            onClick={handleToggleMenu}
            aria-label={hamburgerLabel}
            aria-expanded={isMenuOpen}
            aria-controls="header-mobile-menu"
          >
            <span className="header__hamburger-line" />
            <span className="header__hamburger-line" />
            <span className="header__hamburger-line" />
          </button>
        </nav>
      </div>

      {isMenuOpen && (
        <div id="header-mobile-menu" className="header__mobile-menu">
          <nav className="header__mobile-nav" aria-label="Navegação mobile">
            {renderNavLinks(
              "header__mobile-nav-link",
              "header__mobile-nav-link--active",
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
