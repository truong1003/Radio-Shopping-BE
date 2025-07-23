import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/brands/brand.entity';
import { Voucher } from './voucher.entity';
import { CreateVoucherDto } from './voucher.dto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private readonly repo: Repository<Voucher>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateVoucherDto) {
    const brand = await this.brandRepo.findOneBy({ title_brand: dto.title_brand });
    if (!brand) throw new NotFoundException('Brand not found');

    const schedule = this.repo.create({
      code: dto.code,
      discount_percent: dto.discount_percent,
      discount_amount: dto.discount_amount,
      start_date: dto.start_date,
      end_date: dto.end_date,
      description: dto.description,
      total_voucher: dto.total_voucher,
      brand,
    });
    return this.repo.save(schedule);
  }
}
