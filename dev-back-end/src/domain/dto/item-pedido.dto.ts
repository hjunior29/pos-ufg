import { IsNumber, IsNotEmpty, Min } from 'class-validator';

/**
 * DTO para ItemPedido
 * Representa um item dentro de um pedido
 */
export class ItemPedidoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantidade: number;
}

export class CreateItemPedidoDto extends ItemPedidoDto {}

export class UpdateItemPedidoDto {
  @IsNumber()
  @Min(0)
  quantidade?: number;
}
