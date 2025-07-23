import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/types/type';
import { CreateVoucherDto } from './voucher.dto';
import { VouchersService } from './voucher.service';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly service: VouchersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post()
  create(@Body() dto: CreateVoucherDto) {
    return this.service.create(dto);
  }
}
