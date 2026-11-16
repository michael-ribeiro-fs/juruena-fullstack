import { useRef, useState } from "react";

import PlaceCard from "../../components/PlaceCard/PlaceCard.jsx";
import CTA from "../../components/CTA/CTA.jsx";
import { PLACES_LIST } from "../../components/Places/data";

import {
  PLACES_PAGE_EYEBROW,
  PLACES_PAGE_TITLE,
  PLACES_PAGE_SUBTITLE,
  PLACES_FILTER_CATEGORIES,
  PLACES_SEARCH_PLACEHOLDER,
  PLACES_SEARCH_ARIA_LABEL,
  PLACES_CLEAR_SEARCH_LABEL,
  PLACES_EMPTY_TITLE,
  PLACES_EMPTY_TEXT,
  PLACES_EMPTY_BUTTON_LABEL,
} from "./data";

import "./PlacesPage.css";

function PlacesPage({ onCreateAccountClick, onSignInClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const searchInputRef = useRef(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPlaces = PLACES_LIST.filter((place) => {
    const matchesCategory =
      activeCategory === "Todos" || place.tag === activeCategory;
    const matchesQuery =
      normalizedQuery === "" ||
      place.title.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  const resultsLabel =
    filteredPlaces.length === 1
      ? "1 lugar encontrado"
      : `${filteredPlaces.length} lugares encontrados`;

  const hasActiveFilters = normalizedQuery !== "" || activeCategory !== "Todos";

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("Todos");
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  return (
    <>
      <section className="catalog container">
        <header className="catalog__head">
          <p className="catalog__eyebrow">{PLACES_PAGE_EYEBROW}</p>
          <h1 className="catalog__title">{PLACES_PAGE_TITLE}</h1>
          <p className="catalog__subtitle">{PLACES_PAGE_SUBTITLE}</p>
        </header>

        <div className="catalog__controls">
          <div className="search-bar">
            <svg
              className="search-bar__icon"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="search-bar__input"
              placeholder={PLACES_SEARCH_PLACEHOLDER}
              aria-label={PLACES_SEARCH_ARIA_LABEL}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery !== "" && (
              <button
                type="button"
                className="search-bar__clear"
                onClick={handleClearSearch}
                aria-label={PLACES_CLEAR_SEARCH_LABEL}
              >
                <svg
                  className="search-bar__clear-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="filters">
            <div className="filters__chips">
              {PLACES_FILTER_CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                const chipClassName = isActive
                  ? "filters__chip filters__chip--active"
                  : "filters__chip";

                return (
                  <button
                    key={category}
                    type="button"
                    className={chipClassName}
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <p className="filters__count">{resultsLabel}</p>
          </div>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon-wrap">
              <svg
                className="empty-state__icon"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h2 className="empty-state__title">{PLACES_EMPTY_TITLE}</h2>
            <p className="empty-state__text">{PLACES_EMPTY_TEXT}</p>
            {hasActiveFilters && (
              <button
                type="button"
                className="empty-state__btn"
                onClick={handleResetFilters}
              >
                {PLACES_EMPTY_BUTTON_LABEL}
              </button>
            )}
          </div>
        ) : (
          <ul className="places__grid">
            {filteredPlaces.map((place) => (
              <li key={place.id} className="places__grid-item">
                <PlaceCard
                  image={place.image}
                  alt={place.alt}
                  tag={place.tag}
                  location={place.location}
                  title={place.title}
                  description={place.description}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <CTA
        onCreateAccountClick={onCreateAccountClick}
        onSignInClick={onSignInClick}
      />
    </>
  );
}

export default PlacesPage;
