import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { Customer } from 'src/customers/customer.entity';
import { Voucher } from 'src/voucher/voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History, Voucher])],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [TypeOrmModule],
})
export class HistoryModule {}
