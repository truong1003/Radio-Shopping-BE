import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Brand } from 'src/brands/brand.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { VoucherModule } from 'src/voucher/voucher.module';
import { HistoryModule } from 'src/history/history.module';
import { Account } from 'src/accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Brand, Account]), VoucherModule, HistoryModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
