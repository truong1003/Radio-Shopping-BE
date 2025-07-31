import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/types/type';
import { CreateCustomerDto } from './customer.dto';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  findAll(@Query('phone') phone?: string) {
    return this.service.findAll(phone);
  }

  @Get('stats')
  getPhoneStatsWithLatestCustomer(@Query('search') search?: string) {
    return this.service.getPhoneStatsWithLatestCustomer(search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('today')
  getTodayCustomers(@Request() req) {
    const user = req.user
    return this.service.getTodayCustomers(user);
  }

  @Get(':phone_number')
  getCustomerById(@Param('phone_number') phone_number: string) {
    return this.service.getCustomerById(phone_number);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }
}
