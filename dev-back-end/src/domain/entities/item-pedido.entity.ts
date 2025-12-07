import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { ItemCardapio } from './item-cardapio.entity';

@Entity('itens_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens)
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  @Column()
  pedidoId: number;

  @ManyToOne(() => ItemCardapio, (itemCardapio) => itemCardapio.itensPedido)
  @JoinColumn({ name: 'itemCardapioId' })
  itemCardapio: ItemCardapio;

  @Column()
  itemCardapioId: number;
}
