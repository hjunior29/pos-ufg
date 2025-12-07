import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoComItensDto, AdicionarItemDto } from './pedido.dto';
import { Pedido, StatusPedido } from '../../domain/entities/pedido.entity';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  // ==========================================
  // URIs CRUD
  // ==========================================

  @Get()
  async findAll(@Query('status') status?: StatusPedido): Promise<Pedido[]> {
    if (status) {
      return this.pedidoService.findByStatus(status);
    }
    return this.pedidoService.findAll();
  }

  @Get('conta/:contaId')
  async findByConta(@Param('contaId', ParseIntPipe) contaId: number): Promise<Pedido[]> {
    return this.pedidoService.findByConta(contaId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return this.pedidoService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: CreatePedidoComItensDto): Promise<Pedido> {
    return this.pedidoService.create(createDto);
  }

  @Post(':id/itens')
  async adicionarItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() itemDto: AdicionarItemDto,
  ): Promise<Pedido> {
    return this.pedidoService.adicionarItem(id, itemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pedidoService.remove(id);
  }

  // ==========================================
  // URIs NÃO-CRUD
  // ==========================================

  /**
   * PESSOA 2 - URI NÃO-CRUD
   * Enviar pedido para a cozinha
   * POST /pedidos/:id/enviar-cozinha
   */
  @Post(':id/enviar-cozinha')
  async enviarParaCozinha(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return this.pedidoService.enviarParaCozinha(id);
  }

  /**
   * Marcar pedido como em preparo (usado pela cozinha)
   * PATCH /pedidos/:id/em-preparo
   */
  @Patch(':id/em-preparo')
  async marcarEmPreparo(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return this.pedidoService.marcarEmPreparo(id);
  }

  /**
   * Marcar pedido como pronto (usado pela cozinha)
   * PATCH /pedidos/:id/pronto
   */
  @Patch(':id/pronto')
  async marcarPronto(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return this.pedidoService.marcarPronto(id);
  }

  /**
   * Marcar pedido como entregue (usado pelo garçom)
   * PATCH /pedidos/:id/entregue
   */
  @Patch(':id/entregue')
  async marcarEntregue(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return this.pedidoService.marcarEntregue(id);
  }
}
