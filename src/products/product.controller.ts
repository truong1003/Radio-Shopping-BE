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
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/types/type';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Request() req, @Query('search') search?: string) {
    const user = req.user;
    return this.service.findAll(user, search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('detail/:id')
  findDetail(@Param('id') id: string) {
    return this.service.findDetail(+id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string, @Request() req) {
  //   const user = req.user;
  //   return this.service.findOneWithAuth(+id, user);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateProductDto, @Request() req) {
    const user = req.user;
    return this.service.create(dto, user);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.admin)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: Partial<CreateBrandDto>) {
  //   return this.service.update(+id, dto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
