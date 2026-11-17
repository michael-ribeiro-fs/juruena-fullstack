// Serviço de integração com a API Open-Meteo.
// A API é pública, gratuita e NÃO exige chave de autenticação.
// Documentação: https://open-meteo.com/en/docs

const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Coordenadas de Juruena - MT (WGS84)
export const JURUENA_LATITUDE = -10.318;
export const JURUENA_LONGITUDE = -58.359;

const CURRENT_FIELDS = 'temperature_2m,apparent_temperature,weather_code';
const DAILY_FIELDS = 'weather_code,temperature_2m_max,temperature_2m_min';
const FORECAST_DAYS = 4;

export function buildWeatherUrl() {
  const params = new URLSearchParams({
    latitude: JURUENA_LATITUDE,
    longitude: JURUENA_LONGITUDE,
    current: CURRENT_FIELDS,
    daily: DAILY_FIELDS,
    timezone: 'auto',
    forecast_days: FORECAST_DAYS,
  });

  return `${WEATHER_API_BASE_URL}?${params.toString()}`;
}

export function fetchWeather() {
  return fetch(buildWeatherUrl())
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Weather API respondeu com status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      // Relança o erro para quem chamou (Weather.jsx) tratar e mostrar mensagem
      throw new Error(`Falha ao buscar dados do clima: ${error.message}`);
    });
}
