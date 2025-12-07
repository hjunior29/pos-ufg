import { IsInt, IsNotEmpty, IsArray, ValidateNested, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoCreateDto {
  @IsInt()
  @IsNotEmpty()
  itemCardapioId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantidade: number;
}

export class CreatePedidoComItensDto {
  @IsInt()
  @IsNotEmpty()
  contaId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoCreateDto)
  itens: ItemPedidoCreateDto[];
}

export class AdicionarItemDto {
  @IsInt()
  @IsNotEmpty()
  itemCardapioId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantidade: number;
}

export class UpdatePedidoDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoCreateDto)
  itens?: ItemPedidoCreateDto[];
}
