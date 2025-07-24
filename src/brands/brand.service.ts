import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './brand.dto';
import { Account } from '../accounts/account.entity';
import { Status } from 'src/types/type';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private repo: Repository<Brand>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
  ) {}

  async findAll() {
    return this.repo.find({
      where: { deleted: false },
      relations: ['account', 'products', 'vouchers', 'customers'],
    });
  }

  async findOneWithAuth(id: number, user: { userId: number; role: string }) {
    const brand = await this.repo.findOne({
      where: { id },
      relations: ['account', 'products', 'vouchers', 'customers'],
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (user.role !== 'admin' && brand.account.id !== user.userId) {
      throw new ForbiddenException('You are not allowed to access this brand');
    }

    return brand;
  }

  async create(dto: CreateBrandDto) {
    const account = await this.accountRepo.findOneBy({ email: dto.email });
    if (!account) throw new NotFoundException('Account not found');

    const brand = this.repo.create({
      title_brand: dto.title_brand,
      name: dto.name,
      email: dto.email,
      phone_number: dto.phone_number,
      tags: dto.tags,
      description: dto.description,
      status: Status.active,
      account,
    });
    return this.repo.save(brand);
  }

  async update(id: number, dto: Partial<CreateBrandDto>) {
    const brand = await this.repo.findOneBy({ id });
    if (!brand) throw new NotFoundException('Brand not found');

    Object.assign(brand, dto);

    return this.repo.save(brand);
  }

  async updateStatus(id: number) {
    const brand = await this.repo.findOneBy({ id });
    if (!brand) throw new NotFoundException('Brand not found');

    brand.status = brand.status === Status.active ? Status.inactive : Status.active;

    return this.repo.save(brand);
  }

  async remove(id: number) {
    const brand = await this.repo.findOneBy({ id });
    if (!brand) throw new NotFoundException('Brand not found');

    brand.deleted = true;
    return this.repo.save(brand);
  }
}
