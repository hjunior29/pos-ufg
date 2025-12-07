import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesaModule } from './modules/mesa/mesa.module';
import { PedidoModule } from './modules/pedido/pedido.module';
import { ContaModule } from './modules/conta/conta.module';
import { ItemCardapioModule } from './modules/item-cardapio/item-cardapio.module';

// Entidades
import { Mesa } from './domain/entities/mesa.entity';
import { ItemCardapio } from './domain/entities/item-cardapio.entity';
import { Conta } from './domain/entities/conta.entity';
import { Pedido } from './domain/entities/pedido.entity';
import { ItemPedido } from './domain/entities/item-pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'garcom-eletronico.db',
      entities: [Mesa, ItemCardapio, Conta, Pedido, ItemPedido],
      synchronize: true, // Apenas para desenvolvimento - cria as tabelas automaticamente
      logging: true,
    }),
    MesaModule,
    PedidoModule,
    ContaModule,
    ItemCardapioModule,
  ],
})
export class AppModule {}
