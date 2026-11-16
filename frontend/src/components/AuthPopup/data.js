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
