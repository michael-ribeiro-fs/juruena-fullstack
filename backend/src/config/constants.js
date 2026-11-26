'use strict';

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha inválida',
  EMAIL_ALREADY_EXISTS: 'Email já cadastrado',
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  TOKEN_NOT_PROVIDED: 'Token não fornecido',
  INVALID_TOKEN: 'Token inválido',
  ADMIN_ONLY: 'Acesso restrito a administradores',
  PLACE_NOT_FOUND: 'Lugar não encontrado',
  PLACE_ALREADY_EXISTS: 'Já existe um lugar com este slug',
  FAVORITE_NOT_FOUND: 'Favorito não encontrado',
  FAVORITE_ALREADY_EXISTS: 'Este lugar já está nos seus favoritos',
  FAVORITE_FORBIDDEN: 'Você não tem permissão para remover este favorito',
  VALIDATION_ERROR: 'Dados inválidos',
  INTERNAL_ERROR: 'Erro interno do servidor',
};

const PLACE_TAGS = [
  'Natureza',
  'Lazer',
  'Gastronomia',
  'Cultura',
  'Turismo rural',
  'Outros',
];

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PLACE_TAGS,
};
