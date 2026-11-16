import { Link } from "react-router-dom";

import PlaceCard from "../PlaceCard/PlaceCard.jsx";

import {
  PLACES_EYEBROW,
  PLACES_TITLE,
  PLACES_SUBTITLE,
  PLACES_VIEW_ALL_LABEL,
  PLACES_VIEW_ALL_TO,
  PLACES_LIST,
} from "./data";

import "./Places.css";

function Places() {
  return (
    <section id="lugares" className="places" aria-labelledby="places-title">
      <div className="places__inner container">
        <div className="places__header">
          <div className="places__header-left">
            <p className="places__eyebrow">{PLACES_EYEBROW}</p>
            <h2 id="places-title" className="places__title">
              {PLACES_TITLE}
            </h2>
            <p className="places__subtitle">{PLACES_SUBTITLE}</p>
          </div>

          <Link to={PLACES_VIEW_ALL_TO} className="places__view-all">
            <span>{PLACES_VIEW_ALL_LABEL}</span>
            <svg
              className="places__view-all-icon"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        <ul className="places__grid">
          {PLACES_LIST.map((place) => (
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
      </div>
    </section>
  );
}

export default Places;
