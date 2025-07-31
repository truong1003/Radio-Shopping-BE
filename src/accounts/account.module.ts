// src/account/account.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Brand } from 'src/brands/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Brand])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
