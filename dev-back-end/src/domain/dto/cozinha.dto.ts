import { UsuarioDto, CreateUsuarioDto, UpdateUsuarioDto } from './usuario.dto';

/**
 * DTO para Cozinha
 * Representa um usuário da cozinha que recebe pedidos
 */
export class CozinhaDto extends UsuarioDto {}

export class CreateCozinhaDto extends CreateUsuarioDto {}

export class UpdateCozinhaDto extends UpdateUsuarioDto {}
