import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Brand } from 'src/brands/brand.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Voucher } from 'src/voucher/voucher.entity';
import { History } from 'src/history/history.entity';
import { VoucherModule } from 'src/voucher/voucher.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Brand]), // Chỉ cần Customer và Brand ở đây
    VoucherModule, // 👈 Thêm dòng này
    HistoryModule, // 👈 Thêm dòng này
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
