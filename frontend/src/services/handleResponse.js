const NETWORK_ERROR_MESSAGE = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';

export default function handleResponse(res) {
  if (!res.ok) {
    return res.text().then((text) => {
      let errorMessage;
      try {
        const data = JSON.parse(text);
        errorMessage = (data && data.message) || `Erro ${res.status}`;
      } catch {
        errorMessage = res.status >= 500 ? NETWORK_ERROR_MESSAGE : `Erro ${res.status}`;
      }
      throw new Error(errorMessage);
    });
  }
  return res.json();
}
