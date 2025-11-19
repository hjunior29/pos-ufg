import { IsInt, IsDateString, IsNotEmpty } from 'class-validator';

/**
 * DTO para Pedido
 * Representa um pedido feito por um cliente
 */
export class PedidoDto {
  @IsInt()
  @IsNotEmpty()
  numero: number;

  @IsDateString()
  @IsNotEmpty()
  horarioPedido: Date;

  @IsDateString()
  @IsNotEmpty()
  horarioEntrega: Date;
}

export class CreatePedidoDto {
  @IsInt()
  @IsNotEmpty()
  numero: number;

  @IsDateString()
  @IsNotEmpty()
  horarioPedido: Date;
}

export class UpdatePedidoDto {
  @IsInt()
  numero?: number;

  @IsDateString()
  horarioPedido?: Date;

  @IsDateString()
  horarioEntrega?: Date;
}
