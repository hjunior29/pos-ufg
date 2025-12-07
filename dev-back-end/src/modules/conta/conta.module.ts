import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conta } from '../../domain/entities/conta.entity';
import { Mesa } from '../../domain/entities/mesa.entity';
import { ContaController } from './conta.controller';
import { ContaService } from './conta.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conta, Mesa])],
  controllers: [ContaController],
  providers: [ContaService],
  exports: [ContaService],
})
export class ContaModule {}
