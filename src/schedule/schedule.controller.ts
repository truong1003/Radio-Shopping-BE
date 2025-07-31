import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/types/type';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post()
  create(@Body() dto: CreateScheduleDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Request() req) {
    const user = req.user;
    return this.service.findAll(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('today')
  findAllToDay(@Request() req) {
    const user = req.user
    return this.service.findAllToDay(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<UpdateScheduleDto>) {
    return this.service.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
