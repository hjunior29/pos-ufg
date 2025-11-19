import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para Categoria
 * Representa uma categoria de itens do cardápio (pode ter subcategorias)
 */
export class CategoriaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class CreateCategoriaDto extends CategoriaDto {}

export class UpdateCategoriaDto {
  @IsString()
  nome?: string;
}
