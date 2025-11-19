import { UsuarioDto, CreateUsuarioDto, UpdateUsuarioDto } from './usuario.dto';

/**
 * DTO para Gerente
 * Representa um gerente que define cardápios
 */
export class GerenteDto extends UsuarioDto {}

export class CreateGerenteDto extends CreateUsuarioDto {}

export class UpdateGerenteDto extends UpdateUsuarioDto {}
