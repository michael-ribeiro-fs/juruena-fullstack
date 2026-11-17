// Filtro de lugares por categoria e busca textual (nome).
// Extraído de PlacesPage.jsx para ser testável como função pura.
// Export nomeado para manter consistência com o restante do projeto
// (todas as funções são importadas com chaves: { filterPlaces }).

export function filterPlaces(places, category, query) {
  const normalizedQuery = query.trim().toLowerCase();

  return places.filter((place) => {
    const matchesCategory = category === 'Todos' || place.tag === category;
    const matchesQuery = normalizedQuery === ''
      || place.title.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}
