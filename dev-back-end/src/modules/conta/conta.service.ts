import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conta, StatusConta } from '../../domain/entities/conta.entity';
import { Mesa } from '../../domain/entities/mesa.entity';
import { StatusPedido } from '../../domain/entities/pedido.entity';
import { CreateContaDto, UpdateContaDto, ContaResumoDto } from './conta.dto';

@Injectable()
export class ContaService {
  constructor(
    @InjectRepository(Conta)
    private readonly contaRepository: Repository<Conta>,
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async findAll(): Promise<Conta[]> {
    return this.contaRepository.find({
      relations: ['mesa', 'pedidos', 'pedidos.itens', 'pedidos.itens.itemCardapio'],
    });
  }

  async findOne(id: number): Promise<Conta> {
    const conta = await this.contaRepository.findOne({
      where: { id },
      relations: ['mesa', 'pedidos', 'pedidos.itens', 'pedidos.itens.itemCardapio'],
    });
    if (!conta) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
    return conta;
  }

  async findByMesa(mesaId: number): Promise<Conta[]> {
    return this.contaRepository.find({
      where: { mesaId },
      relations: ['pedidos', 'pedidos.itens'],
    });
  }

  async findAbertas(): Promise<Conta[]> {
    return this.contaRepository.find({
      where: { status: StatusConta.ABERTA },
      relations: ['mesa', 'pedidos'],
    });
  }

  async create(createDto: CreateContaDto): Promise<Conta> {
    // Verificar se a mesa existe
    const mesa = await this.mesaRepository.findOne({ where: { id: createDto.mesaId } });
    if (!mesa) {
      throw new NotFoundException(`Mesa com ID ${createDto.mesaId} não encontrada`);
    }

    // Verificar se já existe conta aberta para esta mesa
    const contaAberta = await this.contaRepository.findOne({
      where: { mesaId: createDto.mesaId, status: StatusConta.ABERTA },
    });
    if (contaAberta) {
      throw new BadRequestException(`Já existe uma conta aberta para a mesa ${mesa.numero}`);
    }

    // Ocupar a mesa automaticamente
    if (mesa.disponivel) {
      mesa.disponivel = false;
      await this.mesaRepository.save(mesa);
    }

    const conta = this.contaRepository.create({
      nome: createDto.nome,
      mesaId: createDto.mesaId,
      status: StatusConta.ABERTA,
      dataAbertura: new Date(),
    });

    return this.contaRepository.save(conta);
  }

  async update(id: number, updateDto: UpdateContaDto): Promise<Conta> {
    const conta = await this.findOne(id);
    if (conta.status !== StatusConta.ABERTA) {
      throw new BadRequestException('Não é possível alterar uma conta fechada');
    }
    Object.assign(conta, updateDto);
    return this.contaRepository.save(conta);
  }

  async remove(id: number): Promise<void> {
    const conta = await this.findOne(id);
    if (conta.pedidos && conta.pedidos.length > 0) {
      throw new BadRequestException('Não é possível excluir uma conta que possui pedidos');
    }
    await this.contaRepository.remove(conta);
  }

  // ==========================================
  // URI NÃO-CRUD: Fechar conta e calcular total
  // ==========================================
  async fechar(id: number): Promise<ContaResumoDto> {
    const conta = await this.findOne(id);

    if (conta.status !== StatusConta.ABERTA) {
      throw new BadRequestException(`Conta já está ${conta.status}`);
    }

    // Verificar se todos os pedidos foram entregues
    const pedidosNaoEntregues = conta.pedidos.filter(
      p => p.status !== StatusPedido.ENTREGUE && p.status !== StatusPedido.CRIADO
    );

    if (pedidosNaoEntregues.length > 0) {
      const statusPendentes = pedidosNaoEntregues.map(p => `Pedido #${p.numero}: ${p.status}`).join(', ');
      throw new BadRequestException(
        `Existem pedidos não finalizados: ${statusPendentes}`
      );
    }

    // Calcular valor total de todos os pedidos
    let valorTotal = 0;
    const itensPorPedido = conta.pedidos.map(pedido => {
      const subtotalPedido = pedido.itens.reduce((sum, item) => sum + Number(item.subtotal), 0);
      valorTotal += subtotalPedido;

      return {
        pedidoId: pedido.id,
        numeroPedido: pedido.numero,
        status: pedido.status,
        itens: pedido.itens.map(item => ({
          nome: item.itemCardapio.nome,
          quantidade: Number(item.quantidade),
          precoUnitario: Number(item.precoUnitario),
          subtotal: Number(item.subtotal),
        })),
        subtotalPedido,
      };
    });

    // Atualizar a conta
    conta.valorTotal = valorTotal;
    conta.status = StatusConta.FECHADA;
    conta.dataFechamento = new Date();
    await this.contaRepository.save(conta);

    // Retornar resumo detalhado
    return {
      id: conta.id,
      nome: conta.nome,
      status: conta.status,
      valorTotal,
      dataAbertura: conta.dataAbertura,
      dataFechamento: conta.dataFechamento,
      mesa: {
        id: conta.mesa.id,
        numero: conta.mesa.numero,
      },
      quantidadePedidos: conta.pedidos.length,
      itensPorPedido,
    };
  }

  // ==========================================
  // URI adicional: Obter resumo da conta
  // ==========================================
  async getResumo(id: number): Promise<ContaResumoDto> {
    const conta = await this.findOne(id);

    let valorTotal = 0;
    const itensPorPedido = conta.pedidos.map(pedido => {
      const subtotalPedido = pedido.itens.reduce((sum, item) => sum + Number(item.subtotal), 0);
      valorTotal += subtotalPedido;

      return {
        pedidoId: pedido.id,
        numeroPedido: pedido.numero,
        status: pedido.status,
        itens: pedido.itens.map(item => ({
          nome: item.itemCardapio.nome,
          quantidade: Number(item.quantidade),
          precoUnitario: Number(item.precoUnitario),
          subtotal: Number(item.subtotal),
        })),
        subtotalPedido,
      };
    });

    return {
      id: conta.id,
      nome: conta.nome,
      status: conta.status,
      valorTotal,
      dataAbertura: conta.dataAbertura,
      dataFechamento: conta.dataFechamento,
      mesa: {
        id: conta.mesa.id,
        numero: conta.mesa.numero,
      },
      quantidadePedidos: conta.pedidos.length,
      itensPorPedido,
    };
  }

  // ==========================================
  // URI adicional: Marcar conta como paga
  // ==========================================
  async pagar(id: number): Promise<Conta> {
    const conta = await this.findOne(id);

    if (conta.status !== StatusConta.FECHADA) {
      throw new BadRequestException('A conta precisa estar fechada para ser paga');
    }

    conta.status = StatusConta.PAGA;
    await this.contaRepository.save(conta);

    // Liberar a mesa
    const mesa = await this.mesaRepository.findOne({ where: { id: conta.mesaId } });
    if (mesa) {
      mesa.disponivel = true;
      await this.mesaRepository.save(mesa);
    }

    return conta;
  }
}
