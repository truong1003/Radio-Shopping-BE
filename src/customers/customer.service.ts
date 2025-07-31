import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './customer.dto';
import { Voucher } from 'src/voucher/voucher.entity';
import { History } from 'src/history/history.entity';
import { Account } from 'src/accounts/account.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Voucher) private voucherRepo: Repository<Voucher>,
    @InjectRepository(History) private historyRepo: Repository<History>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
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

  async getTodayCustomers(user: { userId: number; role: string }) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let todayCustomers: any[] = [];
    let oldCustomers: { phone_number: string }[] = [];

    if (user.role === 'admin') {
      todayCustomers = await this.repo.find({
        where: {
          createdAt: Between(startOfDay, endOfDay),
        },
        relations: ['brand'],
        order: { createdAt: 'DESC' },
      });

      oldCustomers = await this.repo
        .createQueryBuilder('customer')
        .select('DISTINCT customer.phone_number', 'phone_number')
        .where('customer.createdAt < :startOfDay', { startOfDay })
        .getRawMany();
    }

    if (user.role === 'brand') {
      const account = await this.accountRepo.findOne({
        where: { id: user.userId },
        relations: ['brand'],
      });

      if (!account?.brand) {
        throw new Error('Tài khoản không có thương hiệu liên kết.');
      }

      todayCustomers = await this.repo.find({
        where: {
          brand: { id: account.brand.id },
          createdAt: Between(startOfDay, endOfDay),
        },
        relations: ['brand'],
        order: { createdAt: 'DESC' },
      });

      oldCustomers = await this.repo
        .createQueryBuilder('customer')
        .leftJoin('customer.brand', 'brand')
        .select('DISTINCT customer.phone_number', 'phone_number')
        .where('customer.createdAt < :startOfDay', { startOfDay })
        .andWhere('brand.id = :brandId', { brandId: account.brand.id })
        .getRawMany();
    }

    const oldPhoneSet = new Set(oldCustomers.map((c) => c.phone_number));

    const newTodayCustomersMap = new Map<string, (typeof todayCustomers)[0]>();
    for (const customer of todayCustomers) {
      if (!oldPhoneSet.has(customer.phone_number)) {
        newTodayCustomersMap.set(customer.phone_number, customer);
      }
    }

    const newTodayCustomers = Array.from(newTodayCustomersMap.values());

    return {
      todayCustomers,
      newTodayCustomers,
    };
  }

  getCustomerById(phone_number: string) {
    return this.repo.find({ where: { phone_number: phone_number } });
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

  async create(dto: CreateCustomerDto) {
    const brand = await this.brandRepo.findOne({
      where: { title_brand: dto.brand_favorite },
    });

    if (!brand) throw new NotFoundException('Brand not found');

    const voucher = await this.voucherRepo.findOne({
      where: { code: dto.code },
    });

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

    const savedCustomer = await this.repo.save(newCustomer);

    if (voucher) {
      const historyVoucher = this.historyRepo.create({
        send_type: dto.send_type,
        phone_number: dto.phone_number,
        voucher,
      });

      await this.historyRepo.save(historyVoucher);
      if (voucher.voucher_sended >= 0) {
        voucher.voucher_sended += 1;
        await this.voucherRepo.save(voucher);
      }
    }

    return savedCustomer;
  }
}
