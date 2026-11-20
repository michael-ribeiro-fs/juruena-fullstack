import {
  WEATHER_ICON_IMAGE,
  WEATHER_ICON_ALT,
  WEATHER_LOCATION_LABEL,
  WEATHER_LOADING_TEXT,
  WEATHER_ERROR_TEXT,
  getWeatherDescription,
  getDayLabel,
} from "./data";

import "./Weather.css";

function Weather({ weatherData, isLoading, hasError }) {
  if (isLoading) {
    return (
      <section className="weather" aria-label="Carregando previsão do tempo">
        <div className="weather__inner container">
          <p className="weather__loading">{WEATHER_LOADING_TEXT}</p>
        </div>
      </section>
    );
  }

  if (hasError || !weatherData) {
    return (
      <section className="weather" aria-label="Erro ao carregar previsão">
        <div className="weather__inner container">
          <p className="weather__error">{WEATHER_ERROR_TEXT}</p>
        </div>
      </section>
    );
  }

  const { current, daily } = weatherData;

  const currentTemperature = Math.round(current.temperature_2m);
  const currentFeelsLike = Math.round(current.apparent_temperature);
  const currentDescription = getWeatherDescription(current.weather_code);

  const forecast = daily.time.map((date, index) => ({
    id: date,
    dayName: getDayLabel(index, daily.time.length),
    high: Math.round(daily.temperature_2m_max[index]),
    low: Math.round(daily.temperature_2m_min[index]),
    condition: getWeatherDescription(daily.weather_code[index]),
  }));

  return (
    <section className="weather" aria-label="Previsão do tempo em Juruena">
      <div className="weather__inner container">
        <div className="weather__row">
          <div className="weather__current">
            <div className="weather__current-group">
              <div className="weather__icon-box" aria-hidden="true">
                <img
                  src={WEATHER_ICON_IMAGE}
                  alt={WEATHER_ICON_ALT}
                  className="weather__icon"
                />
              </div>

              <div>
                <div className="weather__temp-row">
                  <span className="weather__temp">{currentTemperature}°C</span>
                  <span className="weather__feels">
                    Sensação {currentFeelsLike}°C
                  </span>
                </div>
                <p className="weather__desc">
                  {WEATHER_LOCATION_LABEL}{" "}
                  <span className="weather__desc-text">
                    {currentDescription}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <ul className="weather__forecast">
            {forecast.map((day) => (
              <li key={day.id} className="weather__day">
                <span className="weather__day-name">{day.dayName}</span>
                <span className="weather__day-temps">
                  <span className="weather__day-temp-high">{day.high}°</span>
                  <span className="weather__day-sep">/</span>
                  <span className="weather__day-temp-low">{day.low}°</span>
                </span>
                <span className="weather__day-cond">{day.condition}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="weather__note">
          <span className="weather__note-item">
            Dados em tempo real via Open-Meteo API
          </span>
          <span className="weather__note-item">Atualizado automaticamente</span>
        </div>
      </div>
    </section>
  );
}

export default Weather;
