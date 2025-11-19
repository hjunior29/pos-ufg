import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para Conta
 * Representa a conta de uma mesa
 */
export class ContaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class CreateContaDto extends ContaDto {}

export class UpdateContaDto {
  @IsString()
  nome?: string;
}
