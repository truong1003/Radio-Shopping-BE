import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { Customer } from './customer.entity';
import { Brand } from 'src/brands/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Brand])],
  // controllers: [BrandController],
  // providers: [BrandService],
})
export class CustomerModule {}
