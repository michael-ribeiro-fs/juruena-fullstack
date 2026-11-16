import {
  WEATHER_CURRENT_TEMP,
  WEATHER_CURRENT_FEELS_LIKE,
  WEATHER_LOCATION_LABEL,
  WEATHER_CURRENT_DESCRIPTION,
  WEATHER_FORECAST,
  WEATHER_NOTE_TEXT,
  WEATHER_UPDATED_TEXT,
} from "./data";

import "./Weather.css";

function Weather() {
  return (
    <section className="weather" aria-label="Previsão do tempo em Juruena">
      <div className="weather__inner container">
        <div className="weather__row">
          <div className="weather__current">
            <div className="weather__current-group">
              <div className="weather__icon-box" aria-hidden="true">
                <svg
                  className="weather__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66l-1.41 1.41" />
                  <path d="M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>

              <div>
                <div className="weather__temp-row">
                  <span className="weather__temp">{WEATHER_CURRENT_TEMP}</span>
                  <span className="weather__feels">
                    {WEATHER_CURRENT_FEELS_LIKE}
                  </span>
                </div>
                <p className="weather__desc">
                  {WEATHER_LOCATION_LABEL}{" "}
                  <span className="weather__desc-text">
                    {WEATHER_CURRENT_DESCRIPTION}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <ul className="weather__forecast">
            {WEATHER_FORECAST.map((day) => (
              <li key={day.id} className="weather__day">
                <span className="weather__day-name">{day.dayName}</span>
                <span className="weather__day-temps">
                  <span className="weather__day-temp-high">{day.high}</span>
                  <span className="weather__day-sep">/</span>
                  <span className="weather__day-temp-low">{day.low}</span>
                </span>
                <span className="weather__day-cond">{day.condition}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="weather__note">
          <span className="weather__note-item">{WEATHER_NOTE_TEXT}</span>
          <span className="weather__note-item">{WEATHER_UPDATED_TEXT}</span>
        </div>
      </div>
    </section>
  );
}

export default Weather;
