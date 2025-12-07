import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../../domain/entities/mesa.entity';
import { CreateMesaDto, UpdateMesaDto } from '../../domain/dto';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async findAll(): Promise<Mesa[]> {
    return this.mesaRepository.find({ relations: ['contas'] });
  }

  async findOne(id: number): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOne({
      where: { id },
      relations: ['contas'],
    });
    if (!mesa) {
      throw new NotFoundException(`Mesa com ID ${id} não encontrada`);
    }
    return mesa;
  }

  async findDisponiveis(): Promise<Mesa[]> {
    return this.mesaRepository.find({ where: { disponivel: true } });
  }

  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    const existente = await this.mesaRepository.findOne({
      where: { numero: createMesaDto.numero },
    });
    if (existente) {
      throw new ConflictException(`Mesa com número ${createMesaDto.numero} já existe`);
    }
    const mesa = this.mesaRepository.create(createMesaDto);
    return this.mesaRepository.save(mesa);
  }

  async update(id: number, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    const mesa = await this.findOne(id);
    if (updateMesaDto.numero && updateMesaDto.numero !== mesa.numero) {
      const existente = await this.mesaRepository.findOne({
        where: { numero: updateMesaDto.numero },
      });
      if (existente) {
        throw new ConflictException(`Mesa com número ${updateMesaDto.numero} já existe`);
      }
    }
    Object.assign(mesa, updateMesaDto);
    return this.mesaRepository.save(mesa);
  }

  async remove(id: number): Promise<void> {
    const mesa = await this.findOne(id);
    await this.mesaRepository.remove(mesa);
  }

  // ==========================================
  // URI NÃO-CRUD: Ocupar mesa
  // ==========================================
  async ocupar(id: number): Promise<Mesa> {
    const mesa = await this.findOne(id);
    if (!mesa.disponivel) {
      throw new ConflictException(`Mesa ${mesa.numero} já está ocupada`);
    }
    mesa.disponivel = false;
    return this.mesaRepository.save(mesa);
  }

  // ==========================================
  // URI NÃO-CRUD: Liberar mesa
  // ==========================================
  async liberar(id: number): Promise<Mesa> {
    const mesa = await this.findOne(id);
    if (mesa.disponivel) {
      throw new ConflictException(`Mesa ${mesa.numero} já está disponível`);
    }
    mesa.disponivel = true;
    return this.mesaRepository.save(mesa);
  }
}
