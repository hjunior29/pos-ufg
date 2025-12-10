import { DataSource } from 'typeorm';
import { Mesa } from '../domain/entities/mesa.entity';
import { ItemCardapio } from '../domain/entities/item-cardapio.entity';
import { Conta } from '../domain/entities/conta.entity';
import { Pedido } from '../domain/entities/pedido.entity';
import { ItemPedido } from '../domain/entities/item-pedido.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'garcom-eletronico.db',
  entities: [Mesa, ItemCardapio, Conta, Pedido, ItemPedido],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
