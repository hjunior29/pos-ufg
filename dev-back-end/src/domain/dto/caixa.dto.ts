import { UsuarioDto, CreateUsuarioDto, UpdateUsuarioDto } from './usuario.dto';

/**
 * DTO para Caixa
 * Representa um usuário do caixa que gerencia pagamentos
 */
export class CaixaDto extends UsuarioDto {}

export class CreateCaixaDto extends CreateUsuarioDto {}

export class UpdateCaixaDto extends UpdateUsuarioDto {}
