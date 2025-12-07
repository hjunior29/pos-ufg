import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido, StatusPedido } from '../../domain/entities/pedido.entity';
import { ItemPedido } from '../../domain/entities/item-pedido.entity';
import { ItemCardapio } from '../../domain/entities/item-cardapio.entity';
import { Conta, StatusConta } from '../../domain/entities/conta.entity';
import { CreatePedidoComItensDto, AdicionarItemDto } from './pedido.dto';

@Injectable()
export class PedidoService {
  private numeroPedidoSequence = 1;

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(ItemPedido)
    private readonly itemPedidoRepository: Repository<ItemPedido>,
    @InjectRepository(ItemCardapio)
    private readonly itemCardapioRepository: Repository<ItemCardapio>,
    @InjectRepository(Conta)
    private readonly contaRepository: Repository<Conta>,
  ) {
    this.initializeSequence();
  }

  private async initializeSequence() {
    const ultimoPedido = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .orderBy('pedido.numero', 'DESC')
      .getOne();
    if (ultimoPedido) {
      this.numeroPedidoSequence = ultimoPedido.numero + 1;
    }
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      relations: ['conta', 'itens', 'itens.itemCardapio'],
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['conta', 'itens', 'itens.itemCardapio'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  async findByConta(contaId: number): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { contaId },
      relations: ['itens', 'itens.itemCardapio'],
    });
  }

  async findByStatus(status: StatusPedido): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { status },
      relations: ['conta', 'itens', 'itens.itemCardapio'],
    });
  }

  async create(createDto: CreatePedidoComItensDto): Promise<Pedido> {
    // Verificar se a conta existe e está aberta
    const conta = await this.contaRepository.findOne({ where: { id: createDto.contaId } });
    if (!conta) {
      throw new NotFoundException(`Conta com ID ${createDto.contaId} não encontrada`);
    }
    if (conta.status !== StatusConta.ABERTA) {
      throw new BadRequestException('Não é possível adicionar pedidos a uma conta fechada');
    }

    // Criar o pedido
    const pedido = this.pedidoRepository.create({
      numero: this.numeroPedidoSequence++,
      contaId: createDto.contaId,
      status: StatusPedido.CRIADO,
      horarioPedido: new Date(),
    });

    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    // Adicionar itens ao pedido
    for (const itemDto of createDto.itens) {
      await this.adicionarItemInterno(pedidoSalvo.id, itemDto);
    }

    return this.findOne(pedidoSalvo.id);
  }

  private async adicionarItemInterno(pedidoId: number, itemDto: AdicionarItemDto): Promise<ItemPedido> {
    const itemCardapio = await this.itemCardapioRepository.findOne({
      where: { id: itemDto.itemCardapioId },
    });
    if (!itemCardapio) {
      throw new NotFoundException(`Item do cardápio com ID ${itemDto.itemCardapioId} não encontrado`);
    }
    if (!itemCardapio.disponivelNaCozinha) {
      throw new BadRequestException(`Item "${itemCardapio.nome}" não está disponível na cozinha`);
    }

    const subtotal = Number(itemCardapio.preco) * itemDto.quantidade;

    const itemPedido = this.itemPedidoRepository.create({
      pedidoId,
      itemCardapioId: itemDto.itemCardapioId,
      quantidade: itemDto.quantidade,
      precoUnitario: itemCardapio.preco,
      subtotal,
    });

    return this.itemPedidoRepository.save(itemPedido);
  }

  async adicionarItem(pedidoId: number, itemDto: AdicionarItemDto): Promise<Pedido> {
    const pedido = await this.findOne(pedidoId);
    if (pedido.status !== StatusPedido.CRIADO) {
      throw new BadRequestException('Só é possível adicionar itens a pedidos com status CRIADO');
    }

    await this.adicionarItemInterno(pedidoId, itemDto);
    return this.findOne(pedidoId);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    if (pedido.status !== StatusPedido.CRIADO) {
      throw new BadRequestException('Só é possível excluir pedidos com status CRIADO');
    }
    await this.itemPedidoRepository.delete({ pedidoId: id });
    await this.pedidoRepository.remove(pedido);
  }

  // ==========================================
  // URI NÃO-CRUD: Enviar pedido para cozinha
  // ==========================================
  async enviarParaCozinha(id: number): Promise<Pedido> {
    const pedido = await this.findOne(id);

    if (pedido.status !== StatusPedido.CRIADO) {
      throw new BadRequestException(
        `Pedido não pode ser enviado para cozinha. Status atual: ${pedido.status}`
      );
    }

    if (!pedido.itens || pedido.itens.length === 0) {
      throw new BadRequestException('Pedido não possui itens');
    }

    // Verificar se todos os itens estão disponíveis na cozinha
    for (const item of pedido.itens) {
      if (!item.itemCardapio.disponivelNaCozinha) {
        throw new BadRequestException(
          `Item "${item.itemCardapio.nome}" não está disponível na cozinha`
        );
      }
    }

    pedido.status = StatusPedido.ENVIADO_COZINHA;
    return this.pedidoRepository.save(pedido);
  }

  // ==========================================
  // URIs adicionais para fluxo completo
  // ==========================================
  async marcarEmPreparo(id: number): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (pedido.status !== StatusPedido.ENVIADO_COZINHA) {
      throw new BadRequestException('Pedido precisa estar ENVIADO_COZINHA para iniciar preparo');
    }
    pedido.status = StatusPedido.EM_PREPARO;
    return this.pedidoRepository.save(pedido);
  }

  async marcarPronto(id: number): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (pedido.status !== StatusPedido.EM_PREPARO) {
      throw new BadRequestException('Pedido precisa estar EM_PREPARO para ser marcado como pronto');
    }
    pedido.status = StatusPedido.PRONTO;
    return this.pedidoRepository.save(pedido);
  }

  async marcarEntregue(id: number): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (pedido.status !== StatusPedido.PRONTO) {
      throw new BadRequestException('Pedido precisa estar PRONTO para ser entregue');
    }
    pedido.status = StatusPedido.ENTREGUE;
    pedido.horarioEntrega = new Date();
    return this.pedidoRepository.save(pedido);
  }
}
