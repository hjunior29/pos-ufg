import { IsString, IsNumber, IsBoolean, IsNotEmpty, Min } from 'class-validator';

/**
 * DTO para ItemCardapio
 * Representa um item do cardápio do restaurante
 */
export class ItemCardapioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  ingredientes: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  preco: number;

  @IsBoolean()
  @IsNotEmpty()
  disponivelNaCozinha: boolean;
}

export class CreateItemCardapioDto extends ItemCardapioDto {}

export class UpdateItemCardapioDto {
  @IsString()
  nome?: string;

  @IsString()
  ingredientes?: string;

  @IsNumber()
  @Min(0)
  preco?: number;

  @IsBoolean()
  disponivelNaCozinha?: boolean;
}
