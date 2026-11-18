export function filterPlaces(places, category, query) {
  const normalizedQuery = query.trim().toLowerCase();

  return places.filter((place) => {
    const matchesCategory = category === "Todos" || place.tag === category;
    const matchesQuery =
      normalizedQuery === "" ||
      place.title.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}
