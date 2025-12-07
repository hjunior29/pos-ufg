import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Mesa } from './mesa.entity';
import { Pedido } from './pedido.entity';

export enum StatusConta {
  ABERTA = 'ABERTA',
  FECHADA = 'FECHADA',
  PAGA = 'PAGA'
}

@Entity('contas')
export class Conta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({
    type: 'varchar',
    default: StatusConta.ABERTA
  })
  status: StatusConta;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  valorTotal: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataAbertura: Date;

  @Column({ type: 'datetime', nullable: true })
  dataFechamento: Date;

  @ManyToOne(() => Mesa, (mesa) => mesa.contas)
  @JoinColumn({ name: 'mesaId' })
  mesa: Mesa;

  @Column()
  mesaId: number;

  @OneToMany(() => Pedido, (pedido) => pedido.conta)
  pedidos: Pedido[];
}
