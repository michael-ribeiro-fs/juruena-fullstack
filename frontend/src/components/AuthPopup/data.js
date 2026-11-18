/**
 * Dados estáticos do AuthPopup.
 * Constantes em MAIÚSCULAS conforme checklist.
 */

export const AUTH_POPUP_EYEBROW = 'COMUNIDADE JURUENA';

export const AUTH_POPUP_CONTENT = {
  signup: {
    title: 'Faça parte do guia',
    description:
      'Crie sua conta para sugerir novos lugares e roteiros na região.',
    submitLabel: 'Criar conta',
    switchLabel: 'Já tenho conta',
    switchMode: 'signin',
  },
  signin: {
    title: 'Bem-vindo de volta',
    description: 'Entre com seu e-mail e senha para acessar sua conta.',
    submitLabel: 'Fazer login',
    switchLabel: 'Ainda não tem conta?',
    switchMode: 'signup',
  },
};

export const AUTH_POPUP_FIELDS = {
  name: {
    label: 'Nome completo',
    placeholder: 'Seu nome',
    autoComplete: 'name',
  },
  email: {
    label: 'E-mail',
    placeholder: 'seu@email.com',
    autoComplete: 'email',
  },
  passwordSignup: {
    label: 'Senha',
    placeholder: 'Crie uma senha segura',
    autoComplete: 'new-password',
  },
  passwordSignin: {
    label: 'Senha',
    placeholder: 'Digite sua senha',
    autoComplete: 'current-password',
  },
};

export const AUTH_POPUP_CLOSE_LABEL = 'Fechar popup de autenticação';

export const AUTH_VALIDATION_MESSAGES = {
  nameRequired: 'Por favor, informe seu nome.',
  nameTooShort: 'O nome deve ter pelo menos 2 caracteres.',
  emailRequired: 'Por favor, informe seu e-mail.',
  emailInvalid: 'Informe um e-mail válido (exemplo@dominio.com).',
  passwordRequired: 'Por favor, informe sua senha.',
  passwordTooShort: 'A senha deve ter pelo menos 8 caracteres.',
};

export const AUTH_PROTECTED_ROUTE_MESSAGE = 'Registre-se ou entre na sua conta para acessar seus favoritos.';
