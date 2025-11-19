import { IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

/**
 * DTO para Mesa
 * Representa uma mesa do restaurante
 */
export class MesaDto {
  @IsInt()
  @IsNotEmpty()
  numero: number;

  @IsBoolean()
  @IsNotEmpty()
  disponivel: boolean;
}

export class CreateMesaDto extends MesaDto {}

export class UpdateMesaDto {
  @IsInt()
  numero?: number;

  @IsBoolean()
  disponivel?: boolean;
}
