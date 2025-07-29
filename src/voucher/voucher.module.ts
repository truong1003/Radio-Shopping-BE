// src/schedule/schedule.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brands/brand.entity';
import { Voucher } from './voucher.entity';
import { VouchersService } from './voucher.service';
import { VoucherController } from './voucher.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, Brand])],
  providers: [VouchersService],
  controllers: [VoucherController],
  exports: [TypeOrmModule],
})
export class VoucherModule {}
