import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './customer.dto';
import { CustomerStatus } from 'src/types/type';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  async findAll(phone?: string) {
    const where = phone ? { phone_number: phone } : {};

    return this.repo.find({
      where,
      relations: ['brand'],
      order: {
        createdAt: 'DESC',
      },
    });
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

  async create(dto: CreateCustomerDto) {
    const brand = await this.brandRepo.findOne({
      where: { title_brand: dto.brand_favorite },
      relations: ['account'],
    });

    if (!brand) throw new NotFoundException('Brand not found');

    const newCustomer = this.repo.create({
      name: dto.name,
      phone_number: dto.phone_number,
      status: dto.status,
      note: dto.note,
      brand,
      order_amount: dto.order_amount || null,
      product: dto.product || null,
      brand_favorite: dto.brand_favorite,
    });

    return this.repo.save(newCustomer);
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
