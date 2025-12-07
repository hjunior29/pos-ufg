import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemPedido } from './item-pedido.entity';

@Entity('itens_cardapio')
export class ItemCardapio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  ingredientes: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column({ default: true })
  disponivelNaCozinha: boolean;

  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.itemCardapio)
  itensPedido: ItemPedido[];
}
