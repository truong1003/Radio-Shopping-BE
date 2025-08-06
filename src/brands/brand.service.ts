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

  async findAll(search?: string) {
    const query = this.repo
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.accounts', 'accounts')
      .leftJoinAndSelect('brand.products', 'products')
      .leftJoinAndSelect('brand.vouchers', 'vouchers')
      .leftJoinAndSelect('brand.customers', 'customers')
      .where('brand.deleted = false');

    if (search) {
      query.andWhere(`(brand.title_brand LIKE :search OR brand.name LIKE :search)`, {
        search: `%${search}%`,
      });
    }

    query.orderBy('brand.createdAt', 'DESC');

    return query.getMany();
  }

  async findOneWithAuth(id: number, user: { userId: number; role: string }) {
    const query = this.repo
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.accounts', 'accounts')
      .leftJoinAndSelect('brand.products', 'products')
      .leftJoinAndSelect('brand.vouchers', 'vouchers')
      .leftJoinAndSelect('brand.schedules', 'schedules')
      .leftJoinAndSelect('brand.customers', 'customers')
      .where('brand.id = :id', { id })
      .orderBy('customers.createdAt', 'DESC');

    const brand = await query.getOne();

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (user.role !== 'admin' && !brand.accounts.some((acc) => acc.id === user.userId)) {
      throw new ForbiddenException('You are not allowed to access this brand');
    }

    return brand;
  }

  async findBrand(user: { userId: number; role: string }) {
    // 1. Lấy account kèm relation brand
    const account = await this.accountRepo.findOne({
      where: { id: user.userId },
      relations: ['brand'],
    });
    if (!account || !account.brand) {
      throw new NotFoundException('Account or Brand not found');
    }

    const brandId = account.brand.id;

    // 2. Build query lấy brand
    const brand = await this.repo
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.accounts', 'accounts')
      .leftJoinAndSelect('brand.products', 'products')
      .leftJoinAndSelect('brand.vouchers', 'vouchers')
      .leftJoinAndSelect('brand.schedules', 'schedules')
      .leftJoinAndSelect('brand.customers', 'customers')
      .where('brand.id = :id', { id: brandId })
      .orderBy('customers.createdAt', 'DESC')
      .getOne();

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async create(dto: CreateBrandDto) {
    const brand = this.repo.create({
      title_brand: dto.title_brand,
      name: dto.name,
      email: dto.email,
      phone_number: dto.phone_number,
      tags: dto.tags,
      description: dto.description,
      status: Status.active,
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
