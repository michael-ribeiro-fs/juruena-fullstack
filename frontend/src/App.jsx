import { useEffect, useState } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";

import { fetchWeather } from "./services/weatherApi";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AuthPopup from "./components/AuthPopup/AuthPopup.jsx";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

import MainPage from "./pages/MainPage/MainPage.jsx";
import PlacesPage from "./pages/PlacesPage/PlacesPage.jsx";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

function App() {
  const history = useHistory();
  const { pathname, hash } = useLocation();

  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    if (!hash) return undefined;
    const frame = requestAnimationFrame(() => {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

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
    setIsAuthPopupOpen(true);
  };

  const handleCloseAuthPopup = () => {
    setIsAuthPopupOpen(false);
  };

  const handleSwitchAuthMode = () => {
    setAuthMode((previous) => (previous === "signup" ? "signin" : "signup"));
  };

  const handleSubmitSignUp = (formValues) => {
    console.log("Signup:", formValues);
  };

  const handleSubmitSignIn = (formValues) => {
    console.log("Signin:", formValues);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    history.push("/");
  };

  const handleFavoriteClick = () => {
    handleOpenAuthPopup("signin");
  };

  return (
    <div className="app">
      <Header
        variant={headerVariant}
        onSignInClick={() => handleOpenAuthPopup("signin")}
        onSignOut={handleSignOut}
      />

      <Switch>
        <Route exact path="/">
          <MainPage
            onCreateAccountClick={() => handleOpenAuthPopup("signup")}
            onSignInClick={() => handleOpenAuthPopup("signin")}
            onFavoriteClick={handleFavoriteClick}
            weatherData={weatherData}
            weatherLoading={weatherLoading}
            weatherError={weatherError}
          />
        </Route>

        <Route path="/lugares">
          <PlacesPage
            onCreateAccountClick={() => handleOpenAuthPopup("signup")}
            onSignInClick={() => handleOpenAuthPopup("signin")}
            onFavoriteClick={handleFavoriteClick}
          />
        </Route>

        <ProtectedRoute path="/favoritos">
          <FavoritesPage
            onCreateAccountClick={() => handleOpenAuthPopup("signup")}
            onSignInClick={() => handleOpenAuthPopup("signin")}
          />
        </ProtectedRoute>

        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>

      <Footer />

      <AuthPopup
        isOpen={isAuthPopupOpen}
        mode={authMode}
        onClose={handleCloseAuthPopup}
        onSwitchMode={handleSwitchAuthMode}
        onSubmitSignUp={handleSubmitSignUp}
        onSubmitSignIn={handleSubmitSignIn}
      />
    </div>
  );
}

export default App;
