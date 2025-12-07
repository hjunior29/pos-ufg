import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Conta } from './conta.entity';
import { ItemPedido } from './item-pedido.entity';

export enum StatusPedido {
  CRIADO = 'CRIADO',
  ENVIADO_COZINHA = 'ENVIADO_COZINHA',
  EM_PREPARO = 'EM_PREPARO',
  PRONTO = 'PRONTO',
  ENTREGUE = 'ENTREGUE'
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  horarioPedido: Date;

  @Column({ type: 'datetime', nullable: true })
  horarioEntrega: Date;

  @Column({
    type: 'varchar',
    default: StatusPedido.CRIADO
  })
  status: StatusPedido;

  @ManyToOne(() => Conta, (conta) => conta.pedidos)
  @JoinColumn({ name: 'contaId' })
  conta: Conta;

  @Column()
  contaId: number;

  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.pedido, { cascade: true })
  itens: ItemPedido[];
}
