/**
 * Dados estáticos da seção About (Sobre a Cidade).
 * Constantes em MAIÚSCULAS conforme checklist.
 */

/* ⚠️ TEMPORÁRIO: a imagem ainda está em URL externa do protótipo.
   Se você salvar a imagem em src/assets/images/about.jpg,
   troque por:
   import aboutImage from '../../assets/images/about.jpg';
   E use aboutImage no lugar da string. */
export const ABOUT_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgkPpr5KGdXoS7fz-DF8uu7RffaIh1RjDfb6zX4PcE4xjYaB0YyBNU8NCGnkXouoO1NngWnHC5ENq3q3h5sxm2-WgCbddPfVX0HwzlYPkZpgfet7H9oqKhvrGwNtK0e2b-D4bdRGNQFh8iXtHUis4QQABxtPllbpgogJHCYzKhVBWp1AptvqRSLAfROORxAg0-5iFipm0CC-Y2gYV7cZoXun3wDEf-n3riNnnm9iU';

export const ABOUT_IMAGE_ALT = 'Margem serena do Rio Juruena com canoa de madeira ancorada ao entardecer';

export const ABOUT_IMAGE_CAPTION = 'Margens serenas do Rio Juruena ao pôr do sol, símbolo da vida e identidade da região.';

export const ABOUT_EYEBROW = 'SOBRE A CIDADE';

export const ABOUT_TITLE = 'Uma cidade no coração da Amazônia';

export const ABOUT_PARAGRAPHS = [
  {
    id: 'intro',
    text: 'Juruena é um município do noroeste de Mato Grosso, marcado por sua relação com a natureza, suas paisagens e a diversidade da região amazônica.',
    isMuted: false,
  },
  {
    id: 'ecosystems',
    text: "Banhada pelas águas generosas do rio homônimo, a região preserva ecossistemas ricos onde florestas densas, quedas d'água cristalinas e a vida ribeirinha convivem com tradições sustentáveis, como a colheita da castanha-do-brasil e o artesanato tradicional.",
    isMuted: true,
  },
  {
    id: 'closing',
    text: 'Aqui, o tempo segue o compasso das correntezas fluviais e o acolhimento do povo mato-grossense convida a uma imersão autêntica e silenciosa.',
    isMuted: true,
  },
];

export const ABOUT_LINK_LABEL = 'Ler mais sobre Juruena';
export const ABOUT_LINK_HREF = 'https://pt.wikipedia.org/wiki/Juruena';
