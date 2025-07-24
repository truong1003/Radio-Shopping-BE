import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Brand } from 'src/brands/brand.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Brand])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
