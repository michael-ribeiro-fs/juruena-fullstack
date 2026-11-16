/**
 * Dados estáticos do bloco Clima (Weather).
 * Constantes em MAIÚSCULAS conforme checklist.
 * Por enquanto são valores de demonstração.
 * Integração real com Open-Meteo API virá em services/weather.js.
 */

export const WEATHER_CURRENT_TEMP = '31°C';
export const WEATHER_CURRENT_FEELS_LIKE = 'Sensação 34°C';
export const WEATHER_LOCATION_LABEL = 'Agora em Juruena ·';
export const WEATHER_CURRENT_DESCRIPTION = 'Ensolarado com brisa fluvial';

export const WEATHER_FORECAST = [
  {
    id: 'tomorrow',
    dayName: 'Amanhã',
    high: '32°',
    low: '22°',
    condition: 'Parcialmente nublado',
  },
  {
    id: 'thursday',
    dayName: 'Quinta',
    high: '29°',
    low: '21°',
    condition: 'Pancadas de chuva',
  },
  {
    id: 'friday',
    dayName: 'Sexta',
    high: '30°',
    low: '21°',
    condition: 'Sol entre nuvens',
  },
  {
    id: 'saturday',
    dayName: 'Sábado',
    high: '33°',
    low: '23°',
    condition: 'Céu limpo',
  },
];

export const WEATHER_NOTE_TEXT = 'Demonstração de dados climáticos locais via integração Open-Meteo API';
export const WEATHER_UPDATED_TEXT = 'Atualizado recentemente';
