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
