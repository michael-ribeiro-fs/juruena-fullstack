import { Link } from "react-router-dom";

import PlaceCard from "../../components/PlaceCard/PlaceCard.jsx";
import CTA from "../../components/CTA/CTA.jsx";

import {
  FAVORITES_EYEBROW,
  FAVORITES_TITLE,
  FAVORITES_SUBTITLE,
  FAVORITES_EMPTY_TITLE,
  FAVORITES_EMPTY_TEXT,
  FAVORITES_EMPTY_BUTTON_LABEL,
  FAVORITES_EXPLORE_PATH,
} from "./data";

import "./FavoritesPage.css";

function FavoritesPage({
  favorites = [],
  onCreateAccountClick,
  onSignInClick,
  onFavoriteClick,
}) {
  const places = favorites.map((favorite) => favorite.place);
  const hasFavorites = places.length > 0;

  return (
    <>
      <section className="favorites-page container">
        <header className="favorites-page__header">
          <p className="favorites-page__eyebrow">{FAVORITES_EYEBROW}</p>
          <h1 className="favorites-page__title">{FAVORITES_TITLE}</h1>
          <p className="favorites-page__subtitle">{FAVORITES_SUBTITLE}</p>
        </header>

        {hasFavorites ? (
          <ul className="favorites-page__grid">
            {places.map((place) => (
              <li key={place._id} className="favorites-page__grid-item">
                <PlaceCard
                  placeId={place._id}
                  image={place.image}
                  alt={place.alt}
                  tag={place.tag}
                  location={place.location}
                  title={place.title}
                  description={place.description}
                  isFavorited
                  onFavoriteClick={onFavoriteClick}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="favorites-empty">
            <svg
              className="favorites-empty__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="favorites-empty__title">{FAVORITES_EMPTY_TITLE}</h2>
            <p className="favorites-empty__text">{FAVORITES_EMPTY_TEXT}</p>
            <Link
              className="favorites-empty__button"
              to={FAVORITES_EXPLORE_PATH}
            >
              {FAVORITES_EMPTY_BUTTON_LABEL}
            </Link>
          </div>
        )}
      </section>

      <CTA
        onCreateAccountClick={onCreateAccountClick}
        onSignInClick={onSignInClick}
      />
    </>
  );
}

export default FavoritesPage;
