import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dto';
import { Brand } from '../brands/brand.entity';
import { Customer } from 'src/customers/customer.entity';
import { Account } from 'src/accounts/account.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
  ) {}
  async findAll(user: { userId: number; role: string }, search?: string) {
    if (user.role === 'admin') {
      const query = this.repo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand');

      if (search?.trim()) {
        query.andWhere(`(brand.title_brand LIKE :search OR product.title_product LIKE :search)`, {
          search: `%${search}%`,
        });
      }

      query.orderBy('product.createdAt', 'DESC');

      return query.getMany();
    }

    if (user.role === 'brand') {
      const account = await this.accountRepo.findOne({
        where: { id: user.userId },
        relations: ['brand'],
      });

      if (!account?.brand) {
        throw new Error('Tài khoản không có thương hiệu liên kết.');
      }

      const query = this.repo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .where('brand.id = :brandId', { brandId: account.brand.id });

      if (search?.trim()) {
        query.andWhere('(brand.title_brand LIKE :search OR product.title_product LIKE :search)', {
          search: `%${search}%`,
        });
      }

      query.orderBy('product.createdAt', 'DESC');

      return query.getMany();
    }
  }

  async findDetail(id: number) {
    const product = await this.repo.findOne({ where: { id: id }, relations: ['brand'] });

    if (!product) {
      throw new Error('Không tìm thấy sản phẩm.');
    }

    const customers = await this.customerRepo.find({
      where: { product: product.title_product },
    });

    return {
      product,
      customers,
    };
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
    console.log(user.userId);

    const brand = await this.brandRepo.findOne({
      where: { title_brand: dto.title_brand },
    });

    if (!brand) throw new NotFoundException('Brand not found');

    // if (user.role !== 'admin' && brand.account.id !== user.userId) {
    //   throw new ForbiddenException('You are not allowed to access this brand');
    // }

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

  async remove(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return this.repo.remove(product);
  }
}
