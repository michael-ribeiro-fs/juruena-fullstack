import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Weather from "./components/Weather/Weather.jsx";

function App() {
  const handleSignInClick = () => {
    // Bloco 2 (Popup de Autenticação) implementará este handler.
    // Por enquanto, apenas registra no console para validar o clique.
    console.log("Botão 'Entrar' clicado — popup ainda não implementado");
  };

  const handleSignOut = () => {
    // Será completo quando o bloco de autenticação for construído.
    // A lógica abaixo já está correta segundo o checklist:
    // - JWT é excluído ao sair
    // - usuário é redirecionado para /
    localStorage.removeItem("jwt");
    // history.push("/") será adicionado no bloco de auth (precisa do useHistory)
  };

  return (
    <div className="app">
      <Header onSignInClick={handleSignInClick} onSignOut={handleSignOut} />
      <Hero />
      <Weather />
    </div>
  );
}

export default App;
