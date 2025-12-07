import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Conta } from './conta.entity';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: number;

  @Column({ default: true })
  disponivel: boolean;

  @OneToMany(() => Conta, (conta) => conta.mesa)
  contas: Conta[];
}
