import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContaService } from './conta.service';
import { CreateContaDto, UpdateContaDto, ContaResumoDto } from './conta.dto';
import { Conta } from '../../domain/entities/conta.entity';

@Controller('contas')
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  // ==========================================
  // URIs CRUD
  // ==========================================

  @Get()
  async findAll(): Promise<Conta[]> {
    return this.contaService.findAll();
  }

  @Get('abertas')
  async findAbertas(): Promise<Conta[]> {
    return this.contaService.findAbertas();
  }

  @Get('mesa/:mesaId')
  async findByMesa(@Param('mesaId', ParseIntPipe) mesaId: number): Promise<Conta[]> {
    return this.contaService.findByMesa(mesaId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Conta> {
    return this.contaService.findOne(id);
  }

  @Get(':id/resumo')
  async getResumo(@Param('id', ParseIntPipe) id: number): Promise<ContaResumoDto> {
    return this.contaService.getResumo(id);
  }

  @Post()
  async create(@Body() createDto: CreateContaDto): Promise<Conta> {
    return this.contaService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateContaDto,
  ): Promise<Conta> {
    return this.contaService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.contaService.remove(id);
  }

  // ==========================================
  // URIs NÃO-CRUD
  // ==========================================

  /**
   * PESSOA 3 - URI NÃO-CRUD
   * Fechar conta e calcular total
   * POST /contas/:id/fechar
   */
  @Post(':id/fechar')
  async fechar(@Param('id', ParseIntPipe) id: number): Promise<ContaResumoDto> {
    return this.contaService.fechar(id);
  }

  /**
   * Marcar conta como paga e liberar mesa
   * POST /contas/:id/pagar
   */
  @Post(':id/pagar')
  async pagar(@Param('id', ParseIntPipe) id: number): Promise<Conta> {
    return this.contaService.pagar(id);
  }
}
