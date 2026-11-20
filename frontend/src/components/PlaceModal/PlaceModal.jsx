import { useEffect } from "react";

import "./PlaceModal.css";

function PlaceModal({ place, onClose }) {
  useEffect(() => {
    if (!place) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [place]);

  useEffect(() => {
    if (!place) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [place, onClose]);

  if (!place) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="place-modal" onClick={handleBackdropClick}>
      <div
        className="place-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-modal-title"
      >
        <button
          type="button"
          className="place-modal__close"
          onClick={onClose}
          aria-label="Fechar detalhes do lugar"
        >
          <svg
            className="place-modal__close-icon"
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

        <div className="place-modal__image-wrap">
          <img
            src={place.image}
            alt={place.alt}
            className="place-modal__image"
          />
        </div>

        <div className="place-modal__body">
          <div className="place-modal__meta">
            <span className="place-modal__tag">{place.tag}</span>
            <span className="place-modal__location">{place.location}</span>
          </div>
          <h2 id="place-modal-title" className="place-modal__title">
            {place.title}
          </h2>
          <p className="place-modal__desc">{place.description}</p>
        </div>
      </div>
    </div>
  );
}

export default PlaceModal;
