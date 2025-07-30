import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../brands/brand.entity';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Customer } from 'src/customers/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand, Customer])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
