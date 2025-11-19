import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

/**
 * DTO para Cliente
 * Representa um cliente que faz pedidos
 */
export class ClienteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsDateString()
  @IsNotEmpty()
  horaChegada: Date;

  @IsDateString()
  horaSaida: Date;
}

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsDateString()
  @IsNotEmpty()
  horaChegada: Date;
}

export class UpdateClienteDto {
  @IsString()
  nome?: string;

  @IsDateString()
  horaChegada?: Date;

  @IsDateString()
  horaSaida?: Date;
}
