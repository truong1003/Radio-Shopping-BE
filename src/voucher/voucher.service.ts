import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Brand } from 'src/brands/brand.entity';
import { Voucher } from './voucher.entity';
import { CreateVoucherDto } from './voucher.dto';
import { DiscountType } from 'src/types/type';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private readonly repo: Repository<Voucher>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  async findAll(search?: string) {
    const where = search
      ? [
          { code: Like(`%${search}%`) },
          { product_apply: Like(`%${search}%`) },
          { brand: { title_brand: Like(`%${search}%`) } },
        ]
      : {};

    return this.repo.find({
      where,
      relations: ['brand'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(dto: CreateVoucherDto) {
    const brand = await this.brandRepo.findOneBy({ title_brand: dto.title_brand });
    if (!brand) throw new NotFoundException('Brand not found');

    const schedule = this.repo.create({
      code: dto.code.toUpperCase(),
      discount_type: dto.discount_type,
      discount_value: Number(dto.discount_value),
      product_apply: dto.product_apply,
      start_date: dto.start_date,
      end_date: dto.end_date,
      description: dto.description,
      total_voucher: Number(dto.total_voucher),
      brand,
    });
    return this.repo.save(schedule);
  }

  async findOne(id: number) {
    const voucher = await this.repo.findOneBy({ id });
    if (!voucher) throw new NotFoundException('Product not found');
    return voucher;
  }

  async remove(id: number) {
    const voucher = await this.repo.findOneBy({ id });
    if (!voucher) throw new NotFoundException('Product not found');
    return this.repo.remove(voucher);
  }
}
