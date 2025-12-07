import { IsString, IsNotEmpty, IsInt, IsOptional, IsEnum } from 'class-validator';
import { StatusConta } from '../../domain/entities/conta.entity';

export class CreateContaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsInt()
  @IsNotEmpty()
  mesaId: number;
}

export class UpdateContaDto {
  @IsOptional()
  @IsString()
  nome?: string;
}

export class ContaResumoDto {
  id: number;
  nome: string;
  status: StatusConta;
  valorTotal: number;
  dataAbertura: Date;
  dataFechamento: Date | null;
  mesa: {
    id: number;
    numero: number;
  };
  quantidadePedidos: number;
  itensPorPedido: {
    pedidoId: number;
    numeroPedido: number;
    status: string;
    itens: {
      nome: string;
      quantidade: number;
      precoUnitario: number;
      subtotal: number;
    }[];
    subtotalPedido: number;
  }[];
}
