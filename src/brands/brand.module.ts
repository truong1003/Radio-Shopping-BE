import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Account } from '../accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Account])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
