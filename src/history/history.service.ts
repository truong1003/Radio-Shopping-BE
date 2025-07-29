import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';
import { Voucher } from 'src/voucher/voucher.entity';
import { Customer } from 'src/customers/customer.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History) private repo: Repository<History>,
    @InjectRepository(Voucher) private voucherRepo: Repository<Voucher>,
  ) {}

  async findAll() {
    return this.repo.find({ relations: ['voucher'] });
  }

  async findByVoucherId(voucherId: number) {
    return this.repo
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.voucher', 'voucher')
      .leftJoinAndMapOne(
        'history.customer',
        'customer',
        'customer',
        'customer.phone_number = history.phone_number',
      )
      .where('voucher.id = :voucherId', { voucherId })
      .orderBy('history.sent_at', 'DESC')
      .getMany();
  }
}
