import Hero from "../../components/Hero/Hero.jsx";
import Weather from "../../components/Weather/Weather.jsx";
import About from "../../components/About/About.jsx";
import Places from "../../components/Places/Places.jsx";
import CTA from "../../components/CTA/CTA.jsx";

function MainPage({
  onCreateAccountClick,
  onSignInClick,
  onFavoriteClick,
  weatherData,
  weatherLoading,
  weatherError,
}) {
  return (
    <>
      <Hero />
      <Weather
        weatherData={weatherData}
        isLoading={weatherLoading}
        hasError={weatherError}
      />
      <About />
      <Places onFavoriteClick={onFavoriteClick} />
      <CTA
        onCreateAccountClick={onCreateAccountClick}
        onSignInClick={onSignInClick}
      />
    </>
  );
}

export default MainPage;
