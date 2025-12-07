import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from '../../domain/entities/mesa.entity';
import { MesaController } from './mesa.controller';
import { MesaService } from './mesa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa])],
  controllers: [MesaController],
  providers: [MesaService],
  exports: [MesaService],
})
export class MesaModule {}
