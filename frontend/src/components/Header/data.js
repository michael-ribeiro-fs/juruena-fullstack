/**
 * Dados estáticos do Header.
 * Constantes em MAIÚSCULAS conforme checklist.
 * Textos, links, imagens e labels centralizados aqui — zero hardcode no JSX.
 */

import headerLogoImage from '../../assets/images/bandeira.png';

export const HEADER_LOGO_TEXT = 'Juruena';
export const HEADER_LOGO_IMAGE = headerLogoImage;
/* Bandeira é decorativa: o texto "Juruena" ao lado já fornece o nome acessível. */
export const HEADER_LOGO_ALT = '';

export const HEADER_NAV_LINKS = [
  { id: 'home', label: 'Início', to: '/' },
  { id: 'places', label: 'Lugares', to: '/lugares' },
  { id: 'favorites', label: 'Favoritos', to: '/favoritos' },
];

export const HEADER_SIGN_IN_LABEL = 'Entrar';
export const HEADER_SIGN_OUT_LABEL = 'Sair';

export const HEADER_MENU_OPEN_LABEL = 'Abrir menu de navegação';
export const HEADER_MENU_CLOSE_LABEL = 'Fechar menu de navegação';
