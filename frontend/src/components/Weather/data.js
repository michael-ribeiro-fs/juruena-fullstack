import weatherIconImage from "../../assets/images/sun_rain.svg";

export const WEATHER_ICON_IMAGE = weatherIconImage;
export const WEATHER_ICON_ALT = "";

export const WEATHER_LOCATION_LABEL = "Agora em Juruena ·";

export const WEATHER_LOADING_TEXT = "Carregando clima...";

export const WEATHER_ERROR_TEXT =
  "Não foi possível carregar os dados do clima. Tente novamente mais tarde.";

// Mapeamento de códigos WMO (Weather Interpretation Codes)
// Fonte: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
const WMO_CODE_MAP = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Nevoeiro",
  48: "Nevoeiro com geada",
  51: "Garoa leve",
  53: "Garoa moderada",
  55: "Garoa densa",
  56: "Garoa congelante leve",
  57: "Garoa congelante densa",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  66: "Chuva congelante leve",
  67: "Chuva congelante forte",
  71: "Neve leve",
  73: "Neve moderada",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Pancadas de chuva leves",
  81: "Pancadas de chuva moderadas",
  82: "Pancadas de chuva violentas",
  85: "Pancadas de neve leves",
  86: "Pancadas de neve fortes",
  95: "Trovoada",
  96: "Trovoada com granizo leve",
  99: "Trovoada com granizo forte",
};

export function getWeatherDescription(code) {
  return WMO_CODE_MAP[code] || "Condição desconhecida";
}

export function getDayLabel(index, totalDays) {
  if (index === 0) return "Hoje";
  if (index === 1) return "Amanhã";

  const date = new Date();
  date.setDate(date.getDate() + index);

  const dayName = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  if (index === 2 && totalDays > 3) return "Depois de amanhã";

  return capitalized;
}
