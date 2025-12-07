import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from '../../domain/entities/pedido.entity';
import { ItemPedido } from '../../domain/entities/item-pedido.entity';
import { ItemCardapio } from '../../domain/entities/item-cardapio.entity';
import { Conta } from '../../domain/entities/conta.entity';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, ItemPedido, ItemCardapio, Conta])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}
