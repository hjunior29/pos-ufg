import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCardapio } from '../../domain/entities/item-cardapio.entity';
import { ItemCardapioController } from './item-cardapio.controller';
import { ItemCardapioService } from './item-cardapio.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemCardapio])],
  controllers: [ItemCardapioController],
  providers: [ItemCardapioService],
  exports: [ItemCardapioService],
})
export class ItemCardapioModule {}
