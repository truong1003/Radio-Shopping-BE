import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
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

  async getTodayCustomers() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayCustomers = await this.repo.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
      relations: ['brand'],
      order: {
        createdAt: 'DESC',
      },
    });

    const oldCustomers = await this.repo
      .createQueryBuilder('customer')
      .select('DISTINCT customer.phone_number', 'phone_number')
      .where('customer.createdAt < :startOfDay', { startOfDay })
      .getRawMany();

    const oldPhoneNumbers = oldCustomers.map((c) => c.phone_number);

    const newTodayCustomers = todayCustomers.filter(
      (c) => !oldPhoneNumbers.includes(c.phone_number),
    );

    return {
      todayCustomers,
      newTodayCustomers,
    };
  }

  async getPhoneStatsWithLatestCustomer(search?: string) {
    const query = this.repo
      .createQueryBuilder('c')
      .innerJoin(
        (qb) =>
          qb
            .select('sub.phone_number', 'phone_number')
            .addSelect('MAX(sub.createdAt)', 'latestCreatedAt')
            .from(Customer, 'sub')
            .groupBy('sub.phone_number'),
        'latest',
        'c.phone_number = latest.phone_number AND c.createdAt = latest.latestCreatedAt',
      )
      .leftJoinAndSelect('c.brand', 'brand')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(*)')
            .from(Customer, 'total')
            .where('total.phone_number = c.phone_number'),
        'totalCalls',
      )
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(*)')
            .from(Customer, 'orders')
            .where('orders.phone_number = c.phone_number')
            .andWhere("orders.status = 'ORDER'"),
        'totalOrders',
      );

    // 👇 Thêm điều kiện tìm kiếm nếu có search
    if (search) {
      query.andWhere(
        `(c.phone_number LIKE :search OR c.name LIKE :search OR c.email LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    query.orderBy('c.createdAt', 'DESC');

    const { raw, entities } = await query.getRawAndEntities();

    return entities.map((customer, index) => ({
      customer,
      totalCalls: Number(raw[index].totalCalls),
      totalOrders: Number(raw[index].totalOrders),
      latestCall: customer.createdAt,
    }));
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
      email: dto.email,
      address: dto.address,
      brand,
      order_amount: dto.order_amount || null,
      product: dto.product || null,
      brand_favorite: dto.brand_favorite,
    });

    return this.repo.save(newCustomer);
  }
}
