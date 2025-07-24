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

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string, @Request() req) {
  //   const user = req.user;
  //   return this.service.findOneWithAuth(+id, user);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.admin)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: Partial<CreateCustomerDto>) {
  //   return this.service.update(+id, dto);
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Put('status/:id')
  // updateStatus(@Param('id') id: string) {
  //   return this.service.updateStatus(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.service.remove(+id);
  // }
}
