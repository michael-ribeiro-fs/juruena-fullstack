import { PLACES_FILTER_CATEGORIES } from '../../pages/PlacesPage/data';

export const PLACE_FORM_TAGS = PLACES_FILTER_CATEGORIES.filter(
  (category) => category !== 'Todos',
);

export const PLACE_FORM_LABELS = {
  slug: 'Slug (URL)',
  image: 'URL da imagem',
  alt: 'Descrição da imagem (alt)',
  tag: 'Categoria',
  location: 'Localização',
  title: 'Título',
  description: 'Descrição',
};

export const PLACE_FORM_PLACEHOLDERS = {
  slug: 'cachoeira-aguas-claras',
  image: 'https://...',
  alt: 'Descrição breve da imagem',
  location: 'Ex: Centro, Área rural',
  title: 'Nome do lugar',
  description: 'Descrição detalhada do lugar',
};

export const PLACE_FORM_SUBMIT_LABEL = 'Adicionar lugar';
export const PLACE_FORM_SUBMITTING_LABEL = 'Adicionando...';
