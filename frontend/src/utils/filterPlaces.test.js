// Testes unitários da função filterPlaces.
// Usa um mock de dados estável — não depende de PLACES_LIST real.

import { describe, it, expect } from 'vitest';

import { filterPlaces } from './filterPlaces';

const MOCK_PLACES = [
  { id: '1', title: 'Cachoeira das Águas Claras', tag: 'Natureza' },
  { id: '2', title: 'Mirante Beira-Rio', tag: 'Lazer' },
  { id: '3', title: 'Restaurante Sabor das Águas', tag: 'Gastronomia' },
];

describe('filterPlaces', () => {
  it('retorna todos os lugares quando categoria é "Todos" e busca vazia', () => {
    const result = filterPlaces(MOCK_PLACES, 'Todos', '');
    expect(result).toHaveLength(3);
  });

  it('filtra por categoria quando busca está vazia', () => {
    const result = filterPlaces(MOCK_PLACES, 'Natureza', '');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Cachoeira das Águas Claras');
  });

  it('filtra por busca case-insensitive no título', () => {
    const result = filterPlaces(MOCK_PLACES, 'Todos', 'cachoeira');
    expect(result).toHaveLength(1);
  });

  it('retorna lista vazia quando busca não encontra título', () => {
    const result = filterPlaces(MOCK_PLACES, 'Todos', 'inexistente');
    expect(result).toHaveLength(0);
  });

  it('combina categoria + busca (AND lógico)', () => {
    const result = filterPlaces(MOCK_PLACES, 'Natureza', 'cachoeira');
    expect(result).toHaveLength(1);

    const emptyResult = filterPlaces(MOCK_PLACES, 'Natureza', 'restaurante');
    expect(emptyResult).toHaveLength(0);
  });

  it('retorna lista vazia quando categoria não existe', () => {
    const result = filterPlaces(MOCK_PLACES, 'Categoria Inexistente', '');
    expect(result).toHaveLength(0);
  });
});
