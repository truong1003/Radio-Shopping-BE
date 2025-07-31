// src/schedule/schedule.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Brand } from 'src/brands/brand.entity';
import { Account } from 'src/accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Brand, Account])],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
