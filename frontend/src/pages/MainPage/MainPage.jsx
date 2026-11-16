import Hero from "../../components/Hero/Hero.jsx";
import Weather from "../../components/Weather/Weather.jsx";
import About from "../../components/About/About.jsx";
import Places from "../../components/Places/Places.jsx";
import CTA from "../../components/CTA/CTA.jsx";

function MainPage({ onCreateAccountClick, onSignInClick }) {
  return (
    <>
      <Hero />
      <Weather />
      <About />
      <Places />
      <CTA
        onCreateAccountClick={onCreateAccountClick}
        onSignInClick={onSignInClick}
      />
    </>
  );
}

export default MainPage;
