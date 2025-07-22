import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dto';
import { Brand } from '../brands/brand.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  async findAll() {
    return this.repo.find({ relations: ['brand'] });
  }

  // async findOneWithAuth(id: number, user: { userId: number; role: string }) {
  //   const brand = await this.repo.findOne({ where: { id }, relations: ['account'] });

  //   if (!brand) {
  //     throw new NotFoundException('Brand not found');
  //   }

  //   if (user.role !== 'admin' && brand.account.id !== user.userId) {
  //     throw new ForbiddenException('You are not allowed to access this brand');
  //   }

  //   return brand;
  // }

  async create(dto: CreateProductDto, user: { userId: number; role: string }) {
    console.log(user.userId)

    const brand = await this.brandRepo.findOne({
      where: { title_brand: dto.title_brand },
      relations: ['account'],
    });

    console.log(brand?.account.id)

    if (!brand) throw new NotFoundException('Brand not found');

    if (user.role !== 'admin' && brand.account.id !== user.userId) {
      throw new ForbiddenException('You are not allowed to access this brand');
    }

    const product = this.repo.create({
      title_product: dto.title_product,
      description: dto.description,
      brand,
    });

    return this.repo.save(product);
  }

  // async update(id: number, dto: Partial<CreateBrandDto>) {
  //   const brand = await this.repo.findOneBy({ id });
  //   if (!brand) throw new NotFoundException('Brand not found');

  //   Object.assign(brand, dto);

  //   return this.repo.save(brand);
  // }

  // async remove(id: number) {
  //   const brand = await this.repo.findOneBy({ id });
  //   if (!brand) throw new NotFoundException('Brand not found');
  //   return this.repo.remove(brand);
  // }
}
