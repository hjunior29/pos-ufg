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
import { ItemCardapioService } from './item-cardapio.service';
import { CreateItemCardapioDto, UpdateItemCardapioDto } from '../../domain/dto';
import { ItemCardapio } from '../../domain/entities/item-cardapio.entity';

@Controller('itens-cardapio')
export class ItemCardapioController {
  constructor(private readonly itemCardapioService: ItemCardapioService) {}

  @Get()
  async findAll(): Promise<ItemCardapio[]> {
    return this.itemCardapioService.findAll();
  }

  @Get('disponiveis')
  async findDisponiveis(): Promise<ItemCardapio[]> {
    return this.itemCardapioService.findDisponiveis();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ItemCardapio> {
    return this.itemCardapioService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: CreateItemCardapioDto): Promise<ItemCardapio> {
    return this.itemCardapioService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateItemCardapioDto,
  ): Promise<ItemCardapio> {
    return this.itemCardapioService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.itemCardapioService.remove(id);
  }

  @Patch(':id/disponibilidade')
  async alterarDisponibilidade(
    @Param('id', ParseIntPipe) id: number,
    @Body('disponivel') disponivel: boolean,
  ): Promise<ItemCardapio> {
    return this.itemCardapioService.alterarDisponibilidade(id, disponivel);
  }
}
