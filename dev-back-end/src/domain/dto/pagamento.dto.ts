import { IsEnum, IsNumber, IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * Enumeração para tipos de pagamento
 */
export enum TipoPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO = 'CARTAO',
  CHEQUE = 'CHEQUE'
}

/**
 * DTO para Pagamento
 * Representa um pagamento que pode ser feito em dinheiro, cartão ou cheque
 */
export class PagamentoDto {
  @IsEnum(TipoPagamento)
  @IsNotEmpty()
  tipo: TipoPagamento;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  valor: number;
}

export class DinheiroPagamentoDto extends PagamentoDto {
  tipo: TipoPagamento.DINHEIRO;
}

export class CartaoPagamentoDto extends PagamentoDto {
  tipo: TipoPagamento.CARTAO;

  @IsInt()
  @IsNotEmpty()
  nroTransacao: number;
}

export class ChequePagamentoDto extends PagamentoDto {
  tipo: TipoPagamento.CHEQUE;

  @IsInt()
  @IsNotEmpty()
  numero: number;
}

export class CreatePagamentoDto {
  @IsEnum(TipoPagamento)
  @IsNotEmpty()
  tipo: TipoPagamento;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  valor: number;

  // Campos opcionais dependendo do tipo
  @IsInt()
  nroTransacao?: number;

  @IsInt()
  numero?: number;
}
