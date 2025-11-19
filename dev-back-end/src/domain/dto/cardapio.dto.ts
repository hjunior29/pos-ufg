import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para Cardapio
 * Representa o cardápio definido por um gerente
 */
export class CardapioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class CreateCardapioDto extends CardapioDto {}

export class UpdateCardapioDto {
  @IsString()
  nome?: string;
}
