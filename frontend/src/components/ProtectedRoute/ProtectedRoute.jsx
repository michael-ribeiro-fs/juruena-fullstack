import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import CurrentUserContext from "../../contexts/CurrentUserContext";

function ProtectedRoute({ children, requiredRole, ...routeProps }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Route
      {...routeProps}
      render={({ location }) => {
        if (!currentUser) {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location, requiresAuth: true },
              }}
            />
          );
        }

        if (requiredRole && currentUser.role !== requiredRole) {
          return <Redirect to={{ pathname: "/" }} />;
        }

        return children;
      }}
    />
  );
}

export default ProtectedRoute;
