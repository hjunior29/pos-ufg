import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para Usuario
 * Representa um usuário do sistema (Garçom, Gerente, Cozinha, Caixa)
 */
export class UsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}

export class CreateUsuarioDto extends UsuarioDto {}

export class UpdateUsuarioDto {
  @IsString()
  nome?: string;

  @IsString()
  login?: string;

  @IsString()
  senha?: string;
}
