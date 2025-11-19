import { IsString, IsNotEmpty } from 'class-validator';
import { UsuarioDto, CreateUsuarioDto, UpdateUsuarioDto } from './usuario.dto';

/**
 * DTO para Garcom
 * Representa um garçom que atende mesas
 */
export class GarcomDto extends UsuarioDto {}

export class CreateGarcomDto extends CreateUsuarioDto {}

export class UpdateGarcomDto extends UpdateUsuarioDto {}
