import "./PlaceCard.css";

function PlaceCard({ image, alt, tag, location, title, description }) {
  return (
    <article className="place-card">
      <div className="place-card__image-wrap">
        <img
          src={image}
          alt={alt}
          className="place-card__image"
          loading="lazy"
        />
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
