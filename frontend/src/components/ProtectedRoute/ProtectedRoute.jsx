// HOC que protege rotas que exigem autenticação.
// Usa CurrentUserContext para decidir: logado → renderiza filho;
// deslogado → redireciona para "/" com state.from.
//
// ETAPA 1: currentUser sempre null (sem auth real), portanto TODA
// rota protegida redireciona para "/". Comportamento correto.
// ETAPA 3: quando auth real popular o context, a proteção passa
// a funcionar automaticamente, sem alteração de código.

import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import CurrentUserContext from "../../contexts/CurrentUserContext";

function ProtectedRoute({ children, ...routeProps }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Route
      {...routeProps}
      render={({ location }) => {
        if (currentUser) {
          return children;
        }

        return (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location, requiresAuth: true },
            }}
          />
        );
      }}
    />
  );
}

export default ProtectedRoute;
