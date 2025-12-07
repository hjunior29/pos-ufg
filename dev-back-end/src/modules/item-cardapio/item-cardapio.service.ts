import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemCardapio } from '../../domain/entities/item-cardapio.entity';
import { CreateItemCardapioDto, UpdateItemCardapioDto } from '../../domain/dto';

@Injectable()
export class ItemCardapioService {
  constructor(
    @InjectRepository(ItemCardapio)
    private readonly itemCardapioRepository: Repository<ItemCardapio>,
  ) {}

  async findAll(): Promise<ItemCardapio[]> {
    return this.itemCardapioRepository.find();
  }

  async findDisponiveis(): Promise<ItemCardapio[]> {
    return this.itemCardapioRepository.find({ where: { disponivelNaCozinha: true } });
  }

  async findOne(id: number): Promise<ItemCardapio> {
    const item = await this.itemCardapioRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item do cardápio com ID ${id} não encontrado`);
    }
    return item;
  }

  async create(createDto: CreateItemCardapioDto): Promise<ItemCardapio> {
    const existente = await this.itemCardapioRepository.findOne({
      where: { nome: createDto.nome },
    });
    if (existente) {
      throw new ConflictException(`Item com nome "${createDto.nome}" já existe`);
    }
    const item = this.itemCardapioRepository.create(createDto);
    return this.itemCardapioRepository.save(item);
  }

  async update(id: number, updateDto: UpdateItemCardapioDto): Promise<ItemCardapio> {
    const item = await this.findOne(id);
    if (updateDto.nome && updateDto.nome !== item.nome) {
      const existente = await this.itemCardapioRepository.findOne({
        where: { nome: updateDto.nome },
      });
      if (existente) {
        throw new ConflictException(`Item com nome "${updateDto.nome}" já existe`);
      }
    }
    Object.assign(item, updateDto);
    return this.itemCardapioRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemCardapioRepository.remove(item);
  }

  async alterarDisponibilidade(id: number, disponivel: boolean): Promise<ItemCardapio> {
    const item = await this.findOne(id);
    item.disponivelNaCozinha = disponivel;
    return this.itemCardapioRepository.save(item);
  }
}
