// Testes unitários do service de clima.
// Mock de global.fetch para simular sucesso, erro HTTP e falha de rede.
// Requer buildWeatherUrl exportada (já feito).

import {
  describe, it, expect, vi, afterEach,
} from 'vitest';

import { buildWeatherUrl, fetchWeather } from './weatherApi';

describe('buildWeatherUrl', () => {
  it('usa o endpoint correto da Open-Meteo', () => {
    expect(buildWeatherUrl()).toContain(
      'https://api.open-meteo.com/v1/forecast',
    );
  });

  it('inclui latitude, longitude, timezone e forecast_days', () => {
    const url = buildWeatherUrl();

    expect(url).toContain('latitude=-10.318');
    expect(url).toContain('longitude=-58.359');
    expect(url).toContain('timezone=auto');
    expect(url).toContain('forecast_days=4');
  });
});

describe('fetchWeather', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('resolve com dados quando API responde 200 com JSON válido', async () => {
    const mockData = {
      current: {
        temperature_2m: 25,
        apparent_temperature: 27,
        weather_code: 1,
      },
      daily: {
        time: ['2025-01-01'],
        weather_code: [1],
        temperature_2m_max: [30],
        temperature_2m_min: [20],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchWeather();

    expect(result).toEqual(mockData);
  });

  it('rejeita com erro quando API responde 500', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchWeather()).rejects.toThrow(/status 500/);
  });

  it('rejeita com erro customizado quando fetch falha (offline)', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

    await expect(fetchWeather()).rejects.toThrow(
      /Falha ao buscar dados do clima/,
    );
  });

  it('inclui mensagem original do erro quando fetch falha', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

    await expect(fetchWeather()).rejects.toThrow(/Network Error/);
  });
});
