/**
 * Dados estáticos do Footer.
 * Constantes em MAIÚSCULAS conforme checklist.
 */

import footerLogoImage from '../../assets/images/bandeira.png';

export const FOOTER_LOGO_TEXT = 'Juruena';
export const FOOTER_LOGO_IMAGE = footerLogoImage;
/* Bandeira é decorativa: o texto "Juruena" ao lado já fornece o nome acessível. */
export const FOOTER_LOGO_ALT = '';

export const FOOTER_TAGLINE = 'Descubra o que Juruena tem de melhor.';

export const FOOTER_NAV_HEADING = 'Navegação';
export const FOOTER_NAV_LINKS = [
  { id: 'home', label: 'Início', to: '/' },
  { id: 'places', label: 'Lugares', to: '/lugares' },
  { id: 'favorites', label: 'Favoritos', to: '/favoritos' },
];

export const FOOTER_CREDITS_HEADING = 'Créditos & Referências';
export const FOOTER_CREDITS_PAIRS = [
  { id: 'weather', label: 'Dados climáticos:', source: 'Open-Meteo' },
  { id: 'territory', label: 'Informações territoriais:', source: 'Wikipedia' },
];
export const FOOTER_CREDITS_NOTE = 'Projeto desenvolvido por Michael Ribeiro';

export const FOOTER_COPYRIGHT_YEAR = new Date().getFullYear();
export const FOOTER_COPYRIGHT_OWNER = 'Juruena. Todos os direitos reservados.';

export const FOOTER_META_LOCATION = 'Mato Grosso, Brasil';
export const FOOTER_META_TYPE = 'Guia Regional e Cultural';
