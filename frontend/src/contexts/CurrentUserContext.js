import { createContext } from 'react';

/**
 * Contexto do usuário autenticado.
 * Valor: objeto do usuário (ex.: { name, email }) ou null se deslogado.
 * Provider será configurado no App quando o bloco de autenticação for construído.
 */
const CurrentUserContext = createContext(null);

export default CurrentUserContext;
