import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto, UpdateMesaDto } from '../../domain/dto';
import { Mesa } from '../../domain/entities/mesa.entity';

@Controller('mesas')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  // ==========================================
  // URIs CRUD
  // ==========================================

  @Get()
  async findAll(): Promise<Mesa[]> {
    return this.mesaService.findAll();
  }

  @Get('disponiveis')
  async findDisponiveis(): Promise<Mesa[]> {
    return this.mesaService.findDisponiveis();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Mesa> {
    return this.mesaService.findOne(id);
  }

  @Post()
  async create(@Body() createMesaDto: CreateMesaDto): Promise<Mesa> {
    return this.mesaService.create(createMesaDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMesaDto: UpdateMesaDto,
  ): Promise<Mesa> {
    return this.mesaService.update(id, updateMesaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mesaService.remove(id);
  }

  // ==========================================
  // URIs NÃO-CRUD
  // ==========================================

  /**
   * PESSOA 1 - URI NÃO-CRUD
   * Ocupar uma mesa (marca como indisponível)
   * PATCH /mesas/:id/ocupar
   */
  @Patch(':id/ocupar')
  async ocupar(@Param('id', ParseIntPipe) id: number): Promise<Mesa> {
    return this.mesaService.ocupar(id);
  }

  /**
   * Liberar uma mesa (marca como disponível)
   * PATCH /mesas/:id/liberar
   */
  @Patch(':id/liberar')
  async liberar(@Param('id', ParseIntPipe) id: number): Promise<Mesa> {
    return this.mesaService.liberar(id);
  }
}
