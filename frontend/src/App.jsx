import { useEffect, useState } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";

import { fetchWeather } from "./services/weatherApi";
import { signUp, signIn, getCurrentUser } from "./services/authApi";
import { getPlaces } from "./services/placesApi";
import CurrentUserContext from "./contexts/CurrentUserContext";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AuthPopup from "./components/AuthPopup/AuthPopup.jsx";
import {
  AUTH_PROTECTED_ROUTE_MESSAGE,
  AUTH_SIGNUP_SUCCESS_MESSAGE,
  AUTH_API_ERROR_MESSAGES,
} from "./components/AuthPopup/data";
import CookieBanner from "./components/CookieBanner/CookieBanner.jsx";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

import MainPage from "./pages/MainPage/MainPage.jsx";
import PlacesPage from "./pages/PlacesPage/PlacesPage.jsx";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

function App() {
  const history = useHistory();
  const { pathname, hash, state: locationState } = useLocation();

  const [currentUser, setCurrentUser] = useState(null);

  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [authMessage, setAuthMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  useEffect(() => {
    if (locationState && locationState.requiresAuth) {
      setAuthMessage(AUTH_PROTECTED_ROUTE_MESSAGE);
      setAuthMode("signin");
      setIsAuthPopupOpen(true);
      history.replace({ ...history.location, state: {} });
    }
  }, [locationState, history]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return undefined;

    let isMounted = true;
    getCurrentUser(token)
      .then((user) => {
        if (!isMounted) return;
        setCurrentUser(user);
      })
      .catch((error) => {
        if (!isMounted) return;
        const isNetworkIssue = error.message.includes("Failed to fetch");
        if (!isNetworkIssue) {
          localStorage.removeItem("jwt");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    getPlaces()
      .then((data) => {
        if (!isMounted) return;
        setPlaces(data);
        setPlacesError(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setPlacesError(true);
      })
      .finally(() => {
        if (!isMounted) return;
        setPlacesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchWeather()
      .then((data) => {
        if (!isMounted) return;
        setWeatherData(data);
        setWeatherError(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setWeatherError(true);
      })
      .finally(() => {
        if (!isMounted) return;
        setWeatherLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const headerVariant = pathname === "/" ? "transparent" : "solid";

  const handleOpenAuthPopup = (initialMode) => {
    setAuthMode(initialMode);
    setAuthMessage("");
    setApiError("");
    setIsAuthPopupOpen(true);
  };

  const handleCloseAuthPopup = () => {
    setIsAuthPopupOpen(false);
    setAuthMessage("");
    setApiError("");
  };

  const handleSwitchAuthMode = () => {
    setAuthMode((previous) => (previous === "signup" ? "signin" : "signup"));
    setApiError("");
  };

  const buildApiErrorMessage = (error) => {
    if (error.message.includes("Failed to fetch")) {
      return AUTH_API_ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message;
  };

  const handleSubmitSignUp = ({ name, email, password }) => {
    setApiError("");
    signUp({ name, email, password })
      .then(() => {
        setAuthMessage(AUTH_SIGNUP_SUCCESS_MESSAGE);
        setAuthMode("signin");
      })
      .catch((error) => {
        setApiError(buildApiErrorMessage(error));
      });
  };

  const handleSubmitSignIn = ({ email, password }) => {
    setApiError("");
    signIn({ email, password })
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        return getCurrentUser(data.token);
      })
      .then((user) => {
        setCurrentUser(user);
        handleCloseAuthPopup();
      })
      .catch((error) => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setApiError(buildApiErrorMessage(error));
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    history.push("/");
  };

  const handleFavoriteClick = () => {
    if (!currentUser) {
      handleOpenAuthPopup("signin");
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Header
          variant={headerVariant}
          onSignInClick={() => handleOpenAuthPopup("signin")}
          onSignOut={handleSignOut}
        />

        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <MainPage
                  onCreateAccountClick={() => handleOpenAuthPopup("signup")}
                  onSignInClick={() => handleOpenAuthPopup("signin")}
                  onFavoriteClick={handleFavoriteClick}
                  places={places}
                  weatherData={weatherData}
                  weatherLoading={weatherLoading}
                  weatherError={weatherError}
                />
                <Footer />
              </>
            )}
          />

          <Route
            path="/lugares"
            render={() => (
              <>
                <PlacesPage
                  places={places}
                  placesLoading={placesLoading}
                  placesError={placesError}
                  onCreateAccountClick={() => handleOpenAuthPopup("signup")}
                  onSignInClick={() => handleOpenAuthPopup("signin")}
                  onFavoriteClick={handleFavoriteClick}
                />
                <Footer />
              </>
            )}
          />

          <ProtectedRoute path="/favoritos">
            <>
              <FavoritesPage
                onCreateAccountClick={() => handleOpenAuthPopup("signup")}
                onSignInClick={() => handleOpenAuthPopup("signin")}
              />
              <Footer />
            </>
          </ProtectedRoute>

          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>

        <AuthPopup
          isOpen={isAuthPopupOpen}
          mode={authMode}
          onClose={handleCloseAuthPopup}
          onSwitchMode={handleSwitchAuthMode}
          onSubmitSignUp={handleSubmitSignUp}
          onSubmitSignIn={handleSubmitSignIn}
          message={authMessage}
          apiError={apiError}
        />

        <CookieBanner />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
