import { describe, it, expect } from 'vitest';

import { getWeatherDescription, getDayLabel } from './data';

describe('getWeatherDescription', () => {
  it('retorna "Céu limpo" para código 0', () => {
    expect(getWeatherDescription(0)).toBe('Céu limpo');
  });

  it('retorna "Chuva leve" para código 61', () => {
    expect(getWeatherDescription(61)).toBe('Chuva leve');
  });

  it('retorna "Trovoada" para código 95', () => {
    expect(getWeatherDescription(95)).toBe('Trovoada');
  });

  it('retorna "Condição desconhecida" para código fora do mapa', () => {
    expect(getWeatherDescription(999)).toBe('Condição desconhecida');
  });
});

describe('getDayLabel', () => {
  it('retorna "Hoje" para index 0', () => {
    expect(getDayLabel(0, 4)).toBe('Hoje');
  });

  it('retorna "Amanhã" para index 1', () => {
    expect(getDayLabel(1, 4)).toBe('Amanhã');
  });

  it('retorna "Depois de amanhã" para index 2 quando totalDays > 3', () => {
    expect(getDayLabel(2, 4)).toBe('Depois de amanhã');
  });

  it('retorna dia da semana capitalizado para index 2 quando totalDays <= 3', () => {
    const result = getDayLabel(2, 3);

    expect(result).not.toBe('Depois de amanhã');
    expect(result.length).toBeGreaterThan(0);
    expect(result.charAt(0)).toBe(result.charAt(0).toUpperCase());
  });
});
