import { Link } from "react-router-dom";

import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <section className="not-found container">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Página não encontrada</h1>
      <p className="not-found__text">
        A página que você procura não existe ou foi movida.
      </p>
      <Link to="/" className="not-found__link">
        Voltar para a home
      </Link>
    </section>
  );
}

export default NotFoundPage;
