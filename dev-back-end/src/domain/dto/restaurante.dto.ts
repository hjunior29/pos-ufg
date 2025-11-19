import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para Restaurante
 * Representa a entidade principal do sistema
 */
export class RestauranteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class CreateRestauranteDto extends RestauranteDto {}

export class UpdateRestauranteDto {
  @IsString()
  nome?: string;
}
