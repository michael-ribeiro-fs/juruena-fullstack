import { useState } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AuthPopup from "./components/AuthPopup/AuthPopup.jsx";

import MainPage from "./pages/MainPage/MainPage.jsx";
import PlacesPage from "./pages/PlacesPage/PlacesPage.jsx";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

function App() {
  const history = useHistory();
  const { pathname } = useLocation();

  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

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
          />
        </Route>

        <Route path="/lugares">
          <PlacesPage
            onCreateAccountClick={() => handleOpenAuthPopup("signup")}
            onSignInClick={() => handleOpenAuthPopup("signin")}
          />
        </Route>

        <Route path="/favoritos">
          <FavoritesPage
            onCreateAccountClick={() => handleOpenAuthPopup("signup")}
            onSignInClick={() => handleOpenAuthPopup("signin")}
          />
        </Route>

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
