// Testes de validação dos dados estáticos de Places.
// Garantem que PLACES_LIST está consistente (sem duplicatas, campos
// obrigatórios preenchidos, tags válidas).

import { describe, it, expect } from 'vitest';

import { PLACES_LIST } from './data';
import { PLACES_FILTER_CATEGORIES } from '../../pages/PlacesPage/data';

describe('PLACES_LIST — validação de dados', () => {
  it('tem 6 lugares', () => {
    expect(PLACES_LIST).toHaveLength(6);
  });

  it('todos os lugares têm id único', () => {
    const ids = PLACES_LIST.map((place) => place.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it('todos os lugares têm image e alt não vazios', () => {
    PLACES_LIST.forEach((place) => {
      expect(place.image).toBeTruthy();
      expect(place.alt).toBeTruthy();
    });
  });

  it('todos os lugares têm tag que pertence às categorias válidas', () => {
    PLACES_LIST.forEach((place) => {
      expect(PLACES_FILTER_CATEGORIES).toContain(place.tag);
    });
  });

  it('todos os lugares têm title, location e description não vazios', () => {
    PLACES_LIST.forEach((place) => {
      expect(place.title).toBeTruthy();
      expect(place.location).toBeTruthy();
      expect(place.description).toBeTruthy();
    });
  });
});
