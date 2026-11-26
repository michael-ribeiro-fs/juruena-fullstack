import PlaceForm from "../../components/PlaceForm/PlaceForm.jsx";

import {
  ADMIN_PAGE_EYEBROW,
  ADMIN_PAGE_TITLE,
  ADMIN_PAGE_SUBTITLE,
  ADMIN_FORM_TITLE,
  ADMIN_LIST_TITLE,
  ADMIN_LIST_EMPTY,
  ADMIN_DELETE_LABEL,
  ADMIN_DELETE_CONFIRM,
} from "./data";

import "./AdminPage.css";

function AdminPage({
  places = [],
  placesLoading = false,
  placesError = false,
  onCreatePlace,
  onDeletePlace,
}) {
  const handleDelete = (placeId) => {
    if (window.confirm(ADMIN_DELETE_CONFIRM)) {
      onDeletePlace(placeId).catch(() => {
        /* erro exibido pelo App se necessário */
      });
    }
  };

  return (
    <section className="admin container">
      <header className="admin__head">
        <p className="admin__eyebrow">{ADMIN_PAGE_EYEBROW}</p>
        <h1 className="admin__title">{ADMIN_PAGE_TITLE}</h1>
        <p className="admin__subtitle">{ADMIN_PAGE_SUBTITLE}</p>
      </header>

      <section className="admin__section">
        <h2 className="admin__section-title">{ADMIN_FORM_TITLE}</h2>
        <PlaceForm onSubmit={onCreatePlace} />
      </section>

      <section className="admin__section">
        <h2 className="admin__section-title">{ADMIN_LIST_TITLE}</h2>

        {placesLoading && (
          <p className="admin__loading">Carregando lugares...</p>
        )}

        {!placesLoading && placesError && (
          <p className="admin__error">
            Não foi possível carregar os lugares. Tente novamente.
          </p>
        )}

        {!placesLoading && !placesError && places.length === 0 && (
          <p className="admin__empty">{ADMIN_LIST_EMPTY}</p>
        )}

        {!placesLoading && !placesError && places.length > 0 && (
          <ul className="admin__list">
            {places.map((place) => (
              <li key={place._id} className="admin__item">
                <div className="admin__item-info">
                  <span className="admin__item-title">{place.title}</span>
                  <span className="admin__item-meta">
                    {place.tag} · {place.location}
                  </span>
                </div>
                <button
                  type="button"
                  className="admin__item-delete"
                  onClick={() => handleDelete(place._id)}
                >
                  {ADMIN_DELETE_LABEL}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

export default AdminPage;
