import "./PlaceCard.css";

function PlaceCard({
  image,
  alt,
  tag,
  location,
  title,
  description,
  onFavoriteClick,
}) {
  return (
    <article className="place-card">
      <div className="place-card__image-wrap">
        <img
          src={image}
          alt={alt}
          className="place-card__image"
          loading="lazy"
        />
        <button
          type="button"
          className="place-card__favorite"
          onClick={onFavoriteClick}
          aria-label={`Salvar ${title} nos favoritos`}
        >
          <svg
            className="place-card__favorite-icon"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="place-card__body">
        <div className="place-card__meta">
          <span className="place-card__tag">{tag}</span>
          <span className="place-card__location">{location}</span>
        </div>
        <h3 className="place-card__title">{title}</h3>
        <p className="place-card__desc">{description}</p>
      </div>
    </article>
  );
}

export default PlaceCard;
